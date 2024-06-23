# Report Card Helper

This web app creates a frontend for the Younghoon Elementary School report card PDF to remove some of the manual input that is required if using the PDF.

## To-do List

### p4

- added: next to each subject achievement, there will be 3 graphs: (1) a line graph that shows the current student's history at Younghoon, (2) a bar graph of the distribution of the current class, and (3) a bar graph of the distribution of the whole grade.

### p3

- added: ingested all the data in [the spreadsheet](https://docs.google.com/spreadsheets/d/1nY6fEE1_C9idh2KdKHgh9Dr7T-69v7kdvCFpG91WcyA/edit?usp=sharing) and inserted it into the db
  - this requires every single student have their own unique id, which it does in the the db, but not in the spreadsheet so there's no way to tell them apart
- added: created a map to the PDF (must skip the first 2 pages's
- added: Google refresh token is now handled, prompting the user to reauthorize
- added: ingested the comments from [2024 Comments S1](https://docs.google.com/document/d/1xXIa8AHNXQWyHHjBBiuycQ7uT5LQPWu3l9NMzGXtj-g/edit?usp=sharing)

### p2

- added: a way to import all data when creating a class
- added: a way to export all data for a given class, so it may be imported should anything go wrong
- added: can now add student(s)
- added: can now edit a class
- added: can now edit a student

### p1

- added: 21st Century Skills (...) now have descriptions for each

### p0

- added: UI elements update the DB on change on `/report`
- added: UI elements are set based on student data loaded on `/report`
- added: semester 1 and semester 2 tasks complete on the student roster page now load the correct numbers

## Change Log

2024/06/23

- added: created a parser for the comment files
- added: users can now upload Subject Achievement comments; inputs: year, grade, semester. Ensure the user knows that those comments already exist if wanting to reupload.
- added: breadcrumbs to the topnav
- added: can now remove a student from a class
- added: can now remove a class
- added: create class button now has a loading state

2024/06/22

- added: when a user signs up, they are added to the teacher DB with their Clerk userId and a demo class is added to their class list
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
