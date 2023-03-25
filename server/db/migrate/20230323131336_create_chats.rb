class CreateChats < ActiveRecord::Migration[7.0]
  def change
    create_table :chats do |t|
      t.references :room, :null => false
      t.string :username, :null => false
      t.string :message, :null => false

      t.timestamps
    end
    add_foreign_key :chats, :rooms
    add_index :chats, :created_at
  end
end
