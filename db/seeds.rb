require 'faker'

5.times do
	User.create(name: Faker::Name.name, username: Faker::Internet.user_name)
end

user_ids = (0..4).to_a # user ids array

department_names = ["Sewage", "Electrical", "Fire", "DOT"]
department_names.each do |department|
	Department.create(dept_name: department)
end

# (37.772194 + (rand(25514).to_f/1000000)) # random lat in SF
# (122.402006 + (rand(31811).to_f/1000000)) # random lng in SF

report_types = %w[pothole street_light transformer power_line tree fire_hydrant road_sign sewage other]

10.times do
	Report.create(report_name: report_types.sample, report_type: report_types.sample, user_id: user_ids.sample, lat: (37.772194 + (rand(25514).to_f/1000000)), lng: (122.402006 + (rand(31811).to_f/1000000)), status: 'pending', votecount: 1)
end

report_ids = (0..9).to_a # report ids array

20.times do
	Comment.create(content: Faker::Lorem.sentence, user_id: user_ids.sample, report_id: report_ids.sample)
end