class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :note_message
      t.timestamps
    end
  end
end
