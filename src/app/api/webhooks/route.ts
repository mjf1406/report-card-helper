"use server"

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { type WebhookEvent } from '@clerk/nextjs/server'
import insertTeacher from '~/server/actions/insertTeacher'
import insertClass, { type Data } from '~/server/actions/insertClass'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import type { StudentField } from '~/server/db/types'
import { LoremIpsum } from "lorem-ipsum";
import type { StudentId } from '~/server/actions/insertClass'
import updateStudentField from '~/server/actions/updateStudentField'

interface UserCreatedEventData {
  id: string;
}
interface EventData {
  id?: string;
}
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});
function generateSkill(complete: boolean): string {
  const options = ["", "", "", "", "AB", "CD", "P", "NY"];
  let randomIndex
  if (complete) {
    randomIndex = Math.floor(Math.random() * options.length);
    while (randomIndex === 0 || randomIndex === 1 || randomIndex === 2 || randomIndex === 3) {
      randomIndex = Math.floor(Math.random() * options.length);
    }
  } else randomIndex = Math.floor(Math.random() * options.length);
  return String(options[randomIndex]);
}
function generateSubjectAchievementScore(complete: boolean): string {
  const options = ["", "", "", "", "1", "2", "3", "4", "5"];
  let randomIndex
  if (complete) {
    randomIndex = Math.floor(Math.random() * options.length);
    while (randomIndex === 0 || randomIndex === 1 || randomIndex === 2 || randomIndex === 3) {
      randomIndex = Math.floor(Math.random() * options.length);
    }
  } else randomIndex = Math.floor(Math.random() * options.length);
  return String(options[randomIndex]);
}
function generateFields(complete: boolean): StudentField {
  return {
    field_id: "",
    student_id: "",
    collaboration: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    communication: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    inquiry: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    listening: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    mathematics: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    open_minded: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    organization: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    reading: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    responsibility: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    risk_taking: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    science: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    social_studies: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    speaking: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    thinking: {
      s1: generateSkill(complete),
      s2: generateSkill(complete),
    },
    use_of_english: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    writing: {
      s1: generateSubjectAchievementScore(complete),
      s2: generateSubjectAchievementScore(complete),
      s1_comment: "",
      s2_comment: ""
    },
    comment: { 
      s1: lorem.generateParagraphs(4), 
      s2: lorem.generateParagraphs(4)
    },
  } as StudentField
}
function generateStudentFieldData(complete: boolean, studentIds: StudentId){
  const fields = generateFields(complete)
  return {
    ...fields,
    student_id: studentIds.sid,
    field_id: studentIds.fid,
  } as StudentField
}

function isUserCreatedEventData(data: EventData): data is UserCreatedEventData { // Type guard to check if evt.data is UserCreatedEventData
  return typeof data.id === 'string';
}

const currentYear = new Date().getFullYear()
const completeClassDemo: Data = {
  class_id: undefined,
  class_name: "Demo, Complete",
  class_language: 'en',
  class_grade: '5',
  class_year: String(currentYear),
  role: 'primary',
  fileContents: `number,sex,name_ko,name_en
1,f,이지현,Lee Jihyun
2,m,박민수,Park Minsu
3,f,김수정,Kim Sujeong
4,m,이현우,Lee Hyunwoo
5,m,정우성,Jung Woosung
6,f,최수연,Choi Suyeon
7,f,오누리,Oh Nuri
8,m,김민준,Kim Minjun
`,
}
const incompleteClassDemo: Data = {
  class_id: undefined,
  class_name: "Demo, Incomplete",
  class_language: 'en',
  class_grade: '5',
  class_year: String(currentYear),
  role: 'primary',
  fileContents: `number,sex,name_ko,name_en
1,f,김유진,Kim Yujin
2,m,이도현,Lee Dohyun
3,f,박민지,Park Minji
4,m,최준영,Choi Junyoung
5,m,한동훈,Han Donghoon
6,f,정하나,Jung Hana
7,f,윤서연,Yoon Seoyeon
8,m,류재민,Ryu Jaemin
`,
}
export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json() as object[]
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    })
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  if (eventType === 'user.created') {
    const data = evt.data as EventData;
    if (isUserCreatedEventData(data)) {
      const userId = data.id;
      if (userId) { 
        console.log("🚀 ~ POST ~ userId:", userId)
        
        await insertTeacher(userId);
        // Insert complete demo class
        const completeStudentIds: string = await insertClass(completeClassDemo, userId, true) 
        const completeStudentIdsJson: StudentId[] = JSON.parse(completeStudentIds) as StudentId[]
        const completeData = completeStudentIdsJson.map(student => {
          return generateStudentFieldData(true, student)
        })
        await updateStudentField(completeData)
        
        // Insert incomplete demo class
        const incompleteStudentIds: string = await insertClass(incompleteClassDemo, userId, false) 
        const incompleteStudentIdsJson: StudentId[] = JSON.parse(incompleteStudentIds) as StudentId[]
        const incompleteData = incompleteStudentIdsJson.map(student => {
          return generateStudentFieldData(false, student)
        })
        await updateStudentField(incompleteData)

        revalidatePath("/classes")
        return NextResponse.redirect(new URL('/classes', req.url))
      }
    } else {
      console.error('Unexpected event data format for user.created:', data);
    }
  }

  return new Response('', { status: 200 })
}