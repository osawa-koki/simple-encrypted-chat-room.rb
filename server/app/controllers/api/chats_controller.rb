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
    @chats = @chats.where("room_id = ? AND created_at > ?", room_id.to_i, Time.at(since.to_i))
    @chats = @chats.limit(per_page)
    render json: @chats
  end
end
