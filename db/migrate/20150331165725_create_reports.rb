class CreateReports < ActiveRecord::Migration
  def change
  	create_table :reports do |t|
      t.string :report_name
      t.string :report_type
      t.string :address
      t.float :lat
      t.float :lng
      t.string :status, :default => 'red'
      t.integer :votecount, :default => 0
      t.integer :user_id
      t.integer :department_id, :default => 1

      t.timestamps null: false
    end
  end
end
