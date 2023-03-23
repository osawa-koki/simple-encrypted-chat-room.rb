class CreateChats < ActiveRecord::Migration[7.0]
  def change
    create_table :chats do |t|
      t.references :room_id, :null => false, :foreign_key => true
      t.string :username, :null => false
      t.string :message, :null => false

      t.timestamps
    end
    add_foreign_key :chats, :rooms, column: :id
  end
end
