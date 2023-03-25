class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    message = data['message']

    chat = Chat.new(
      room_id: params[:room],
      username: message["username"],
      message: message["message"],
    )

    unless chat.valid?
      puts "[ERROR] Chat not valid"
      return
    end

    begin
      if chat.save
        puts "[SUCCESS] Chat saved"
        ActionCable.server.broadcast "room_#{params[:room]}", { message: message }
      else
        puts "[ERROR] Chat not saved"
      end
    rescue ActiveRecord::InvalidForeignKey => e
      puts "[ERROR] Room does not exist."
    end
  end
end
