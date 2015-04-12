class AddNoteImageToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :note_image, :string
  end
end
