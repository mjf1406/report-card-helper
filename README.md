# Report Card Helper

This web app creates a frontend for the Younghoon Elementary School report card PDF to remove some of the manual input that is required if using the PDF.

## To-do List

### dreams

- added: can compare current student to descriptive stats of whole class
- added: can compare current student to descriptive stats of whole grade
- added: dashboard for the whole grade
  - detects outlies and brings them to the user's attention
  - fancy bar graphs

### p3

- find a better spot for the files in public

### p2

- added: created a map to the PDF (must skip the first 2 pages)
- emulate the following sections
  - Cover Page
    - Student Name
    - Student Number
    - Teacher's Name
    - Date
  - 21st Century Skills, Learner Traits and Work Habits (S1 and S2)
    _CD = Consistently Demonstrates: The student applies the skill, trait, or work habit consistently with minimal teacher support._
    _P = Progressing: The student applies the skill, trait, or work habit regularly, though, needs additional teacher support at times._
    _NY = Not Yet: The student has not yet applied the skill, trait, or work habit appropriately or does so with much teacher support. Additional practice is required._
    - Responsibility
    - Organization
    - Collaboration
    - Communication
    - Thinking (Creative and Problem Solving)
    - Inquiry
    - Risk-Taking
    - Open-Minded
- First Comment (text area)
- Subjects (S1 and S2 and Strengths/Next Steps for Improvement)
  - Reading
  - Writing
  - Speaking
  - Listening
  - Use of English
  - Mathematics
  - Social Studies
  - Science
- Final Comment (text area)

### p1

- added: created a comment template for the grades to fill out
- added: created a parser for the comment files
-

### p0

- added: user can log in with Google
- added: user can import a class from Google Classroom
- added: initialized Drizzle or Prisma

## Change-log

2024/06/13

- added: created the above priority to-do list
- added: files to work with are in public (need to perhaps use [uploadthing](https://uploadthing.com/)?)
