import { Response } from 'express';

type SuccessResponseProps = {
  message: string;
  metadata: any;
  status?: number;
  responseStatusMessage?: string;
};
const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ResponseStatusMessage = {
  OK: 'Success',
  CREATED: 'Created',
};

export class SuccessResponse {
  private message: string;
  private status: number;
  private metadata: any;

  constructor({
    message="",
    metadata={},
    status=StatusCode.OK,
    responseStatusMessage="OK"
  }: SuccessResponseProps){
    this.message=!message ? responseStatusMessage : message;
    this.status=status;
    this.metadata=metadata
  };

  send(res:Response,headers?:any){
    return res.status(this.status).json(this)
  }
}

export class OK extends SuccessResponse{
    constructor({message,metadata={},status=StatusCode.OK,responseStatusMessage=ResponseStatusMessage.OK}:SuccessResponseProps){
        super({message,metadata,status,responseStatusMessage});
    }
}

export class CREATED extends SuccessResponse{
    constructor({message,metadata={},status=StatusCode.CREATED,responseStatusMessage=ResponseStatusMessage.CREATED}:SuccessResponseProps){
        super({message,metadata,status,responseStatusMessage});
    }
}

