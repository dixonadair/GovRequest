class Comment < ActiveRecord::Base
  # Remember to create a migration!
  belongs_to :report
  belongs_to :user
end
