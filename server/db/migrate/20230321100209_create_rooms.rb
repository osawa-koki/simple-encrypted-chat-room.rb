class CreateRooms < ActiveRecord::Migration[7.0]
  def change
    create_table :rooms do |t|
      t.string :room_name, :null => false
      t.string :description, :null => false
      t.string :password, :null => false

      t.timestamps
    end
    add_index :rooms, :room_name, unique: true
  end
end
