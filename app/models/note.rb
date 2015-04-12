class Note < ActiveRecord::Base
  belongs_to :user
  mount_uploader :note_image, NoteImageUploader
  reverse_geocoded_by :latitude, :longitude
end
