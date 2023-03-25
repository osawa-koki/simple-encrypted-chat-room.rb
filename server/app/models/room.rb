class Room < ApplicationRecord
  validates :room_name, presence: true, uniqueness: true, length: { in: 3..16 }, format: { with: /\A[a-zA-Z0-9_-]+\z/, message: "must be alphanumeric and contain only '-', '_'" }
end
