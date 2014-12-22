class AddLatLongToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :latitude, :integer
    add_column :notes, :longitude, :integer
  end
end
