import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import ServerError from "ServerError";
import axios, { AxiosResponse } from 'axios';
import { env } from "process";

var sampleImageURL = "https://upload.wikimedia.org/wikipedia/commons/0/06/Ercole_de%27_roberti%2C_san_michele_arcangelo_louvre_01.jpg"

var printfulMockData = (image_url: string) => {
  return {
    "variant_ids": [
        4035
    ],
    "files": [
      {
        "type": "front",
        "image_url": image_url,
        "position": {
          "area_width": 1800,
          "area_height": 2400,
          "width": 1800,
          "height": 1800,
          "top": 300,
          "left": 0
        }
      }
    ]
  }
}

export const printfulRouter = createTRPCRouter({
  createPrintfulShirt: publicProcedure
      .input(z.object({ imageURL: z.string() }))
      .mutation(
        async ({ input }): Promise< { imagePrintfulUrl: string } | ServerError> => {
          try {
            var firstResponse = await axios.post(
              "https://api.printful.com/mockup-generator/create-task/71",
              printfulMockData(input.imageURL),
              {
                headers: {
                  "Authorization": "Bearer " + env.PRINTFUL_TOKEN,
                  "Content-Type": 'application/json',
                }
              }
            ).then( (response) => {
              console.log("sent printful reque and mock task key:")
              console.log(response.status)
              console.log(response.data.result.task_key)
              return response.data.result.task_key;
            }).catch(
              (e) => {
                console.log("printful mockgen post req error")
                console.log(e.response.status)
                return e
              }
            )
            interface pollArg { fn: any, validate: any, interval: any, maxAttempts: any }
            const poll = async ({ fn, validate, interval, maxAttempts }:pollArg) => {
              let attempts = 0;
            
              const executePoll:(arg0: any, arg1: any) => Promise<AxiosResponse<any, any>> = async (resolve, reject):Promise<AxiosResponse<any, any>> => {
                const result = await fn().catch((e) => console.log(`polling fn error with error: \n ${e}`));
                attempts++;
            
                if (validate(result)) {
                  if (result?.data?.result?.status === "completed") {
                    return resolve(result);
                  } else if (result?.data?.result?.status === "failed") {
                    console.log(result);
                    return reject(new Error(result?.data?.result?.error));
                  }
                } else if (maxAttempts && attempts === maxAttempts) {
                  return reject(new Error('Exceeded max attempts'));
                } else {
                  setTimeout(executePoll, interval, resolve, reject);
                }
              };
            
              return new Promise(executePoll);
            };
            const fn2 = async () => {
              return await axios.get(
                'https://api.printful.com/mockup-generator/task', {
                  params: {
                    task_key: firstResponse
                  },
                  headers: {
                    "Authorization": "Bearer " + env.PRINTFUL_TOKEN,
                  }
              }).then( (response) => {
                console.log(`Polling printful gen mock, current status: ${response.data.result.status}`)
                return response
              }).catch( (e) => {
                console.log("printful mockgen get req error")
                return new ServerError("Printful req error");
              })
            }
            const validate2 = (response: AxiosResponse<any, any>): boolean => {
              try {
                return response.data.result.status === "completed" || response.data.result.status === "failed" 
              } catch (e) {
                return false
              }
            }
            return await poll({ fn:fn2, validate:validate2, interval:3000, maxAttempts:7 })
            .then( (response) => {
              return { imagePrintfulUrl: response.data.result.mockups[0].mockup_url }
            }).catch((e) => {
              return new ServerError("Printful req error")
            })
          } catch (error) {
            console.log("printful req error!")
            console.log(error)
            return new ServerError("Printful req errorrr");
          }
        }
      ),
});
