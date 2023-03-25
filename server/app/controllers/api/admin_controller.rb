class Api::AdminController < ApplicationController
  def destroy
    admin_token = ENV["ADMIN_TOKEN"]
    authorization = request.headers["Authorization"]&.remove("Bearer ")

    unless admin_token == authorization
      render json: { errors: ["Invalid token."] }, status: :forbidden
      return
    end

    Chat.delete_all
    Room.delete_all

    render json: { message: "All rooms and chats have been deleted." }, status: :ok
  end
end
