class Department < ActiveRecord::Base
  # Remember to create a migration!
  has_many :reports
end
