# score-visualizer
visualizes scores over time for students in hacking class/competition

designed for deployment in a docker container. uses node.js to host the site, pug for view rendering, and metricsgraphicsJS
on top of d3 for graph visualization. at present, the logic for reading in student scores is bespoke -- the professor's 
"flag" format is idiomatic, and the logic for monitoring and reading in the scores file will not transfer. however, the app
is modular, and by changing a few repository methods it can be made to work with another score/file structure.

to do: 
- automate the generation of aliases to bind distinct flags to the same name according to placement in the same students' directories 
- improve graph visualization by offering multiple options for graph layout and format. 
  - for the line graph, make points appear even without mouseover
