require 'pry'

$questions_collection = []
class QA_Object
	attr_accessor :question, :answers

	def initialize(args={})
		@question = args[:question]
		@answers = []
	end
end


class Answer
	attr_accessor :name, :votes

	def initialize(args={})
		@name = args[:name]
		@votes = args[:votes]
	end
end

def parse_data_file(file)
	File.open(file) do |f|
		f.each_line do |line|
			line.strip!
			next if line.match(/^\s*$/) #if line is empty
			if line.match(/[[:punct:]]+{2,}/) #the line has more than 2 .. (ideally in a row) its an answer
				ary = line.sub(/[[:punct:]]+{2,}/, ':').split(':')
				answer = Answer.new({
					name: ary[0],
					votes: ary[1]
				})
				$questions_collection.last.answers.push(answer)
				# push answer to the last question that was made
			elsif line.match(/\w/) #line just has words which means its a question
			 	question = QA_Object.new({
			 		question: line
			 	})
			 	$questions_collection.push(question)
	  	end
	  end
	end
end


def record_results(file)
	last_question = $questions_collection.last
	$questions_collection.each do |quest|
		last_answer = quest.answers.last
		File.open(file, "a") do |f|
			f.write "{"
			f.write %{"Question": "#{quest.question}", \n}
			f.write %{"Answers": [}
			quest.answers.each do |answer|
				f.write "{"
				f.write %{"name": "#{answer.name}",\n}
				if answer === last_answer
					f.write %{"votes": #{answer.votes}}
					f.write "\n}\n]}"
				else
					f.write %{"votes": #{answer.votes}}
					f.write "\n},\n"
				end
			end
			if quest === last_question
				f.write "\n"				
			else
				f.write ",\n"
			end
		end
	end
end



puts "what file would you like to convert?"
file_to_convert = gets().chomp().to_s

puts "and your destination file?"
destination_file = gets().chomp().to_s

parse_data_file(file_to_convert)
record_results(destination_file)

print "success"
