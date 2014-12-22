class ChangeNotesLatLong < ActiveRecord::Migration
  def change
    change_column :notes, :longitude, :float
    change_column :notes, :latitude, :float
  end
end
