"use server"

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { type WebhookEvent } from '@clerk/nextjs/server'
import insertTeacher from '~/server/actions/insertTeacher'
import insertClass, { type Data } from '~/server/actions/insertClass'

interface UserCreatedEventData {
  id: string;
}
interface EventData {
  id?: string;
}

function generateSkill(): string {
  const options = ["AB", "CD", "P", "NY"];
  const randomIndex = Math.floor(Math.random() * options.length);
  return String(options[randomIndex]);
}
function generateSubjectAchievementScore(): number {
  return Math.floor(Math.random() * 5) + 1;
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
        // Insert complete demo class for the teacher
        await insertClass(completeClassDemo, userId) 
        // await updateStudentField()
        
        // Insert incomplete demo class for the teacher
        await insertClass(incompleteClassDemo, userId) 
        // await updateStudentField()

      }
    } else {
      console.error('Unexpected event data format for user.created:', data);
    }
  }

  return new Response('', { status: 200 })
}