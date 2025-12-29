# Understory - Winter Hackathon 2025

This project is for the winter hackathon at sigma labs which ran for just under two days, ending on Christmas Eve at midday. Understory acts as a proof of concept of a text based game which places accessibility at the heart of the project.

The theme of the hackathon was growth and the requirements were that raw HTML, CSS and JS had to be used as the core of the project, and the project had to be deployable.
 
For this hackathon we decided to develop understory as a basic game with three key accessibility features for users:

* Keyboard Accessibility
* Video Accessibility
* Audio Accessibility

All accessibility features are implemented using pure JS. The video accessibility is also available in Python via its websocket API. However, we were not able to implement its deployment in time, so adjusted to use JS instead.

For deployment, terraform was used for simple IaC. This can be found in the terraform folder. 

Running ./deploy.sh redeployed our code to the EC2 instance that we were using. 

We achieved third place for our efforts for this project!

Any extensions or future work on this project or adjacent projects is welcome and encouraged as this is an original idea to bring to text based games which could provide a lot of value to people with disabilities. 

Get if you have any questions or feedback.

Thank you.

