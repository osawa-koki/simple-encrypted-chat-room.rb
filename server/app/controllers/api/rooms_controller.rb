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
