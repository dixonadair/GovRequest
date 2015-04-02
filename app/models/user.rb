class User < ActiveRecord::Base
  # Remember to create a migration!
  has_many :reports
  has_many :comments
  has_many :votes

  def authenticate(input_password)
    self.password == input_password
  end
end
