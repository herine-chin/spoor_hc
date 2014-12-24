class User < ActiveRecord::Base
  has_many :notes

  def authenticate( password )
    if self.password == password then true else false end
  end

end
