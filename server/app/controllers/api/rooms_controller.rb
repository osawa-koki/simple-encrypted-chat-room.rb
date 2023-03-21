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
    @room = Room.find_by(room_name: params[:id])

    unless @room
      render json: { errors: ["Room not found."] }, status: :not_found
      return
    end

    render json: @room, status: :ok
  end

  def new
    # GET /rooms/new
  end

  def create
    # POST /rooms
    begin
      room_params = JSON.parse(request.body.read).symbolize_keys
    rescue JSON::ParserError
      return render json: { error: "Invalid JSON format" }, status: :unprocessable_entity
    end

    room_password = Digest::SHA256.hexdigest("#{Rails.application.config.hash_digest_salt_prefix}#{room_params[:password]}#{Rails.application.config.hash_digest_salt_suffix}")

    room = Room.new(
      room_name: room_params[:room_name],
      description: room_params[:description],
      password: room_password
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
      render json: { error: room.errors.full_messages.join(", ") }, status: :server_error
    end
  end

  def edit
    # GET /rooms/:id/edit
  end

  def update
    # PATCH /rooms/:id
    @room = Room.find(params[:id])

    begin
      room_data = JSON.parse(request.body.read)
      room_name = room_data["room_name"]
      room_description = room_data["description"]
      room_password = room_data["password"]
    rescue JSON::ParserError
      return render json: { errors: ["Invalid JSON format."] }, status: :unprocessable_entity
    end

    unless @room.room_name == room_name
      unless Room.where(room_name: room_name).empty?
        render json: { errors: ["Room name already exists."] }, status: :unprocessable_entity
        return
      end
    end

    attributes = {}
    attributes[:room_name] = room_name if room_name.present?
    attributes[:description] = room_description if room_description.present?
    attributes[:password] = room_password if room_password.present?

    @room.assign_attributes(attributes)

    unless @room.valid?
      render json: { errors: @room.errors.full_messages }, status: :unprocessable_entity
      return
    end

    saved_password = Room.find(@room.id).password
    input_password = Digest::SHA256.hexdigest("#{Rails.application.config.hash_digest_salt_prefix}#{room_password}#{Rails.application.config.hash_digest_salt_suffix}")

    unless saved_password == input_password
      render json: { errors: ["Invalid password."] }, status: :forbidden
      return
    end

    @room.password = input_password if @room.password.present?

    if @room.save
      render json: @room, status: :ok
    else
      render json: { errors: @room.errors.full_messages }, status: :server_error
    end
  end

  def destroy
    # DELETE /rooms/:id
    @room = Room.find_by(id: params[:id])
    return render json: { errors: ["Room not found."] }, status: :not_found unless @room

    begin
      room_data = JSON.parse(request.body.read)
      room_password = room_data["password"]
    rescue JSON::ParserError
      return render json: { errors: ["Invalid JSON format."] }, status: :unprocessable_entity
    end

    hashed_password = Digest::SHA256.hexdigest("#{Rails.application.config.hash_digest_salt_prefix}#{room_password}#{Rails.application.config.hash_digest_salt_suffix}")

    return render json: { errors: ["Invalid password."] }, status: :forbidden unless @room.password == hashed_password

    @room.destroy
    head :no_content
  end

end
