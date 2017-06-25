# score-visualizer
visualizes scores over time for students in hacking class/competition

designed for deployment in a docker container. uses node.js to host the site, pug for view rendering, and metricsgraphicsJS
on top of d3 for graph visualization. at present, the logic for reading in student scores is bespoke -- the professor's 
"flag" format is idiomatic, and the logic for monitoring and reading in the scores file will not transfer. however, the app
is modular, and by changing a few repository methods it can be made to work with another score/file structure.

docker deployment: docker run -v /route/to/student/scores:/usr/src/app/data -p 80:3000 IMAGE_NAME_HERE node main.js

the -v command is used to mount the directory which contains file output with student scores into the image's data directory. the app consumes the solved.txt file here to populate a database of scores for the students. 

main.js creates the app and handles node routing. controller.js contains the callback functions for each route. repository.js handles all database interactions -- this is the file which must change to handle.

the data object produced by the repository has a data.users property, which is a list of strings corresponding to a student's codename, and a data.points property, which is a list of objects such taht data.points[i] corresponds to data.users[i]. data.points[i][j] has a data.points[i][j].data and data.points[i][j].value property corresponding to a timestamp and a score respectively.

to do: 
- automate the generation of aliases to bind distinct flags to the same name according to placement in the same students' directories 
- improve graph visualization by offering multiple options for graph layout and format. 
  - for the line graph, make points appear even without mouseover
