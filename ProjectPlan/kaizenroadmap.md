# Project Setup Plan

## Project Overview
Sub module for infoscreen to add support for kaizenboard and multi organization setup. 

## Changes to user structure
### Roles
There need to be set up 3 roles, one for user, one for manager and one for admin. 
 * User - Access to view thirsty, and own kaizen cards
 * Manager - Full organization access, can change user permissions for other users in an org and assign new managers. Can add Entries to events, images, rss feeds all that admin has access too only for one org. 
 * Admin - Full access across all orgs. 
### Orgs
Orgs are a new structure, it will be a different dashboard for the entire application for each org, and they will have their own sup domain that they use to access the page.
### Permissions
Permissions can be managed per Role group, managers has the power to adjust this. Potentially new roles can be created, but this is not part of this roadmap

## Project Structure
New page for Kaizen settings is created, and a new view component is added where realtime cards are displayed. A management page is also added so that the manager can go in and adjust the cards. Mail notifications are sent out to the users who are assigned a new card. 

## Development Workflow
Start implementing the kaizen view board, then implement the backend features to display them. Rudamentary first, then add complexity with each feature. Then tie things down with permissions and roles accordingly. 
To display the kaizen, a dash controller has to be added, this controls what modules are displayed on the main dash, and it should be controlled by the manager through the manage page.

## Step by step
1. Rewrite main view to be controlled through management page, control what components are shown on the main page. 
2. Add Kaizenboard widget
3. Connect backend with kaizen board
4. Add management component on management page for organization manager to control the kaizen cards. 
5. Add email notifications. For card changes on save. Send to assigned user, on completion send mail to manager. 


## Guides and References
Finally, include any style guides or API references that developers working on this project should be aware of.