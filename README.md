Linear Algebra Matrix multiplication Sandbox

web application built with React and SVG to visualize 2D linear transformations, matrix operations, and dynamic eigenspace alignment in real time.

This application provides a visual sandbox where users can manipulate 2x2 transformation matrices and 2D vectors. 
Key features include:
1.Interactive range controls for matrix entries and target vector coordinates.
2.characteristic polynomial solver computing real/complex eigenvalues and unit eigenvectors.
3.Dynamic eigenspace alignment indicators that trigger when a target vector aligns with an invariant axis.
4.Dynamic SVG coordinate engine with adaptive auto-scaling.
5.One-click preset shortcuts for Identity, 90 deg Rotation, Horizontal Shear, 2x Scale, and Singular Compression.

my contribution: 
I built this project independently, fully by myself from scratch using React, Vite, and JavaScript.

what i learned:
prior to this, while I had extensive programing expierance in java, python, c, 
I never learned how frontend worked, so getting to learn the languiges and the frameworks
was exciting and rewording. I faced some challanges such as coordinates, (had to adapt to 
top left being 0,0 as opposed to the center), had a lot of edge cases with auto scaling, (like what should happen when v = 0,0 and matrix = 0,0,0,0; what should happen with hyperzooming and so on).


How to run it: 
clone this repository,
cs fsab-project,
install dependencies: npm install, npm run dev 

References
React Documentation (Hooks, State, JSX)
MDN Web Docs ( <svg>, <line>, <circle>, <text>)
Vite Documentation for React environment setup
