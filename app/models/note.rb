class Note < ActiveRecord::Base
  belongs_to :user
  reverse_geocoded_by :latitude, :longitude
end
