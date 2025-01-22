import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

const getCorePrompt = (
  user: Prisma.UserGetPayload<{
    include: { jobExperiences: true };
  }>,
  lastMessages: string,
) => {
  return `Vous êtes AImeric, un agent RH travaillant pour une entreprise et votre mission est d'évaluer un candidat pour connaître les informations
      
        Voici les derniers échanges que vous avez eu avec le candidat au format JSON stringifié:
        \`${lastMessages}\`
        `;
};

const getAnswerPrompt = (
  user: Prisma.UserGetPayload<{
    include: { jobExperiences: true };
  }>,
  lastMessages: string,
) => {
  return `
  Vous êtes un agent recruteur qui doit construire une fiche sur un candidat. Voici ce que vous connaissez du candidat pour le moment. Vous devez remplir uniquement les champs de cet objet
  ${JSON.stringify(user)}

  Construisez la prochaine question à adresser au candidat pour remplir cet objet. Cette question doit se concentrer sur un unique champs de cet objet manquant ou imprécis. Ne retournez que la question
  `;
};

const getUpdateUserPrompt = (
  user: Prisma.UserGetPayload<{
    include: { jobExperiences: true };
  }>,
  lastMessages: string,
) => {
  return `${getCorePrompt(user, lastMessages)}
    
  En sachant que le modèle en base de donnée est défini par Prisma de la manière suivante
  ----
model User {
  id    String @id @unique 
  name  String
  surname String
  email String?
  phone String?
  address String?
  jobExperiences JobExperience[]
  academicExperience AcademicExperience[]
  expectedJob  ExpectedJob? @relation("UserToExpectedJob")
}

model ExpectedJob {
  jobTitle  String
  annualSalary    Int
  user   User?  @relation("UserToExpectedJob", fields: [userId], references: [id])
}

model JobExperience {
    nbMonths Int
    company String
    jobTitle String
    user User @relation(fields: [userId], references: [id])
}

model AcademicExperience {
    level String
    university String
    topic String
    user User @relation(fields: [userId], references: [id])
}
  ---
Pouvez-vous retourner un objet User au format JSON avec toutes les informations de la conversation ? Si vous n'avez pas l'information, laissez le champs vide !
  `;
};

@Injectable()
export class PromptService {
  async postPrompt(prompt: string) {
    var myHeaders = new Headers();
    if (process.env.OPEN_AI_SECRET === undefined) {
      throw new Error(
        'Could not find secret key for OPEN AI, please add a valid API Key to the environment variables',
      );
    }
    myHeaders.append('Authorization', process.env.OPEN_AI_SECRET || '');
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect,
    };
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      requestOptions,
    );

    const responseJson = await response.json();

    return responseJson.choices[0].message.content as string;
  }

  async getUpdatedUser(
    lastMessages: string,
    user: Prisma.UserGetPayload<{
      include: { jobExperiences: true };
    }>,
  ) {
    return await this.postPrompt(getUpdateUserPrompt(user, lastMessages));
  }

  async getAnswer(
    lastMessages: string,
    user: Prisma.UserGetPayload<{
      include: { jobExperiences: true };
    }>,
  ) {
    return await this.postPrompt(getAnswerPrompt(user, lastMessages));
  }
}
