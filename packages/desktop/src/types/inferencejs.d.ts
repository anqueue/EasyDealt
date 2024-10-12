declare module "inferencejs" {
  export class CVImage {
    constructor(videoElement: HTMLVideoElement);
  }

  export class InferenceEngine {
    startWorker(modelName: string, numThreads: number, apiKey: string): Promise<string>;

    infer(workerId: string, image: CVImage): Promise<any[]>;
  }
}
