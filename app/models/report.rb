class Report < ActiveRecord::Base
  # Remember to create a migration!
  belongs_to :user
  belongs_to :department
  has_many :comments
  has_many :votes
end
