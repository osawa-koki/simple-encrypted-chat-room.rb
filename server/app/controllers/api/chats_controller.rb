class Api::ChatsController < ApplicationController
  def index
    # GET /api/chats
    room_id = params[:room_id]
    per_page = params[:per_page] || 30
    since = params[:since] || Time.now.to_i

    unless room_id
      render json: { errors: ["Room ID is required."] }, status: :bad_request
      return
    end

    @chats = Chat.all
    @chats = @chats.where("room_id = ? AND created_at < ?", room_id.to_i, Time.at(since.to_i))
    @chats = @chats.order(created_at: :desc)
    @chats = @chats.limit(per_page)
    render json: @chats
  end

  def create
    # POST /api/chats
    begin
      chat_params = JSON.parse(request.body.read).symbolize_keys
    rescue JSON::ParserError
      return render json: { error: "Invalid JSON format" }, status: :unprocessable_entity
    end

    chat = Chat.new(
      room_id: chat_params[:room_id],
      username: chat_params[:username],
      message: chat_params[:message]
    )

    unless chat.valid?
      render json: { error: chat.errors.full_messages.join(", ") }, status: :unprocessable_entity
      return
    end

    begin
      if chat.save
        render json: chat, status: :created
      else
        render json: { error: chat.errors.full_messages.join(", ") }, status: :server_error
      end
    rescue ActiveRecord::InvalidForeignKey => e
      render json: { error: "Room does not exist.", detail: e }, status: :not_found
    end
  end
end
