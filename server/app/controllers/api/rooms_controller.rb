class Api::RoomsController < ApplicationController
  def index
    # GET /api/rooms
    since_id = params[:since_id] || 0
    per_page = params[:per_page] || 30
    @rooms = Room.all
    @rooms = @rooms.where("id > ?", since_id.to_i)
    @rooms = @rooms.limit(per_page)
    render json: @rooms
  end

  def show
    # GET /rooms/:id
  end

  def new
    # GET /rooms/new
  end

  def create
    # POST /rooms
    room_params = JSON.parse(request.body.read).symbolize_keys
    room = Room.new(
      room_name: room_params[:room_name],
      description: room_params[:description],
      password: Digest::SHA256.hexdigest("#{Rails.application.config.hash_digest_salt_prefix}#{room_params[:password]}#{Rails.application.config.hash_digest_salt_suffix}")
    )

    unless room.valid?
      render json: { error: room.errors.full_messages.join(", ") }, status: :unprocessable_entity
      return
    end

    if Room.exists?(room_name: room_params[:room_name])
      render json: { error: "Room name is already taken" }, status: :unprocessable_entity
      return
    end

    if room.save
      render json: room, status: :created
    else
      render json: { error: room.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  def edit
    # GET /rooms/:id/edit
  end

  def update
    # PATCH /rooms/:id
  end

  def destroy
    # DELETE /rooms/:id
  end
end
