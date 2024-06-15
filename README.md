# Report Card Helper

This web app creates a frontend for the Younghoon Elementary School report card PDF to remove some of the manual input that is required if using the PDF.

## To-do List

### p3

- added: ingested all the data in the spreadsheet and inserted it into the db

### p2

- added: created a comment template for the grades to fill out
- added: created a parser for the comment files
- added: user can now upload a comment file for themselves or the whole grade

### p1

- added: can now delete a class
- added: can now way to delete student(s)
- added: can now add student(s)
- added: can now edit a class
- added: can now edit a student

### p0

- added: Google refresh token is now handled, prompting the user to reauthorize
- added: created a map to the PDF (must skip the first 2 pages)
- added: a way to import all data when creating a class
- added: a way to export all data for a given class, so it may be imported should anything go wrong
- added: finished the report UI
- added: report UI elements update the DB on change
- added: report UI elements are set based on student data loaded

## Change Log

2024/06/15

- added: a grade select when adding a class so that it can be used to compare to other classes later
- added: initialized Drizzle or Prisma
- added: user can log in with Google
- added: can add a class with the Google Sheets template
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
