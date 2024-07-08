# Report Card Helper

This web app creates a frontend for the Younghoon Elementary School report card PDF to remove some of the manual input that is required if using the PDF.

## To-do List

### p5

- backend: need to save the comment to the db because the user can make changes if they want
  - this requires some logic that only pulls from the grade comments if there is no comment saved in StudentFields
  - also, as soon as the value is set for the subject, the subject value and its comment must be saved to the db
  - finally, the comment should be saved when the cursor leaves the textfield, when it's no longer in focus
- add another way to fill out the reports: a drag-and-drop interface where the user cycles through the inputs. For example, a table with columns representing AB, CD, P, and NY for Responsibility. The user then drags students to their desired column and drops them. It allows the user to easily compare students in their class against each other. Could even provide total counts throughout the grade for each column.

### p4

- added: integrated AI so that the tone can be changed to be more positive on button click
- added: next to each subject achievement, there will be 3 graphs: (1) a line graph that shows the current student's history at Younghoon, (2) a bar graph of the distribution of the current class, and (3) a bar graph of the distribution of the whole grade.
- backend: upgrade errors for users to be more descriptive, like if they are unauthorized
  - `roster.tsx`
  - `[classId].tsx`

### p3

- added: Google refresh token is now handled, prompting the user to reauthorize

### p2

- added: can now add student(s)
- added: can now edit a class
- added: can now edit a student
- added: a way to import all data when creating a class
- added: a way to export all data for a given class, so it may be imported should anything go wrong

### p1

- added: created roles: admin and teacher
- added: admins can view and edit all classes
- added: admins can approve student by student and leave notes on things
- added: admins can export all classes as separate PDFs or a single class when ready
- added: ingested all the data in [the spreadsheet](https://docs.google.com/spreadsheets/d/1nY6fEE1_C9idh2KdKHgh9Dr7T-69v7kdvCFpG91WcyA/edit?usp=sharing) and inserted it into the db
  - this requires every single student have their own unique id, which it does in the the db, but not in the spreadsheet so there's no way to tell them apart
  - current 6th graders (gr.6 2024-25) were in 2nd grade in 2020 (gr.2 2020-21) when they started tracking everything
- backend: uploaded PDFs for each grade to uploadthing and implemented them into `printPDF`

### p0

- backend: moved pdf generation to the server
- UX: alert the user if there are no comments in the db
- UI: somehow show that a student has all fields complete in their card on the `/classes/[classId]` page
- UI: redesigned `/report`
- added: a word counter to the skills/habits comments text fields
- UX: user is no longer alerted that data was saved, but only alerted when the data failed to save
- PDF: made the subject achievement comments font smaller
- PDF: made the subject achievement scores font smaller
- PDF: made the skills scores font smaller
- PDF: made the skills/habits comment font larger
- PDF: student numbers are now formatted correctly
- PDF: teacher's name is added to correctly
- PDF: extra line breaks are now trimmed in subject achievement comments

## Change Log

2024/07/07

- backend: move data transformations to the server
- backend: need to set a semester complete in classesTable when it happens
- fixed: social studies subject achievement comments are now working
- backend: subject achievement comments are now properly saved to the db
- backend: added subject achievement comments to the demo classes
- pdf: subject achievement comments font size is now set
- pdf: skills/habit comment font size is now set
- added: there is now a "add demo classes" button on /classes

2024/07/05

- added: created a map to the PDF

2024/07/04

- backend: when a user signs up, demo classes are added to their account, see `webhooks/route.ts`

2024/07/03

- added: the year is now displayed for each class in the class list

2024/07/02

- added: user is now alerted when uploading comments if comments already exist and questioned whether they want to overwrite them.
- added: ingested the comments from [2024 Comments S1](https://docs.google.com/document/d/1xXIa8AHNXQWyHHjBBiuycQ7uT5LQPWu3l9NMzGXtj-g/edit?usp=sharing)
  - writing is still missing
- fixed: if the name_ko name is blank, the class no longer fails to be created. This was caused by the field being set to .notNull() in Drizzle

2024/07/01

- fixed: subject achievement comment text areas are now mutable
- fixed: all the typescript errors
- backend: added user roles and renamed teacher table to users
- backend: added the subject achievement comments back into the schema
- fixed: subject achievement comments now load based on the selected value and the data in the DB

2024/06/30

- added: subject achievement comments now load based on the selected value and the data in the DB
- added: the counts per semester now load the proper numbers
- backend: only users with access to the class can load the class and student data
- added: progress bar for the whole class by semester on the class page

2024/06/29

- added: 21st Century Skills (...) now have descriptions for each
- added: UI elements update the DB on change on `/report`
- added: semester 1 and semester 2 tasks complete on the student roster page now load the correct numbers
- added: behavior comment is loaded now based from the DB
- added: when loading the report page, the window now scrolls to the top

2024/06/26

- added: UI elements are set based on student data loaded on `/report`
- added: there are now skills and habits comment fields for both semester 1 and semester 2
- refactored: `report.tsx` has much cleaner code now

2024/06/23

- added: created a parser for the comment files
- added: users can now upload Subject Achievement comments; inputs: year, grade, semester. Ensure the user knows that those comments already exist if wanting to reupload.
- added: breadcrumbs to the topnav
- added: can now remove a student from a class
- added: can now remove a class
- added: create class button now has a loading state

2024/06/22

- added: when a user signs up, they are added to the teacher DB with their Clerk userId
- added: the csv is now validated
- added: My classes in the nav now has loading state
- added: Open class button now has loading state
- added: Fill out button now has loading state
- added: `/classes` now refreshes when a new class is added

2024/06/17

- feedback: EP Director said there was an issue with lines missing, but I could not replicate the issue. He did notice the text was far too small in the ACHIEVEMENT CODE box, which is true. The font size has been increased to 12 pt. font.

2024/06/16

- added: finished the report UI
- added: subject_achievement_comments table in the DB
- added: created the [Subject Achievement Comments Template](https://docs.google.com/spreadsheets/d/1u277GDdX-56mExqmJrKHLZ1PslTXkcjne9Ischi5QXM/edit?usp=sharing) for the grades to fill out when uploading comments

2024/06/15

- added: a grade select when adding a class so that it can be used to compare to other classes later
- added: initialized Drizzle or Prisma
- added: user can log in with Google
- added: can add a class with the [Class Template](https://docs.google.com/spreadsheets/d/1esh8Wu7e2nNYWg_puYzogWoWbwgRs1PK_8sVoXi0ysY/edit?usp=sharing)
- added: student roster now loads when opening a class
- added: started the form, which can be accessed when clicking the Fill Out button
- added: laid the UI framework for numerous things
- added: spruced up the homepage. I think it's done for now.
- added: moved the My class button to the TopNav
- added: there's an icon on the Open button now
- added: the grade of the class is now displayed in ClassList
- added: a download reports button appears on the class in ClassList if `courese.complete` is true. course.complete is set to true if one of the semesters have all their fields filled in

2024/06/14

- added: maps for the various imports
- added: exported two PDFs for test printing
- added: a very silly and ridiculous name
- added: can log in with Google now and load classes from Google Classroom

2024/06/13

- added: created the above priority to-do list
- added: files to work with are in public (need to perhaps use [uploadthing](https://uploadthing.com/)?)

## Attributions

- [uploadthing](https://uploadthing.com/) for storing the files securely
- [pdfFiller](https://www.pdffiller.com/) for helping me to find the field names, without which, this might not have been possible
-
