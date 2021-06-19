import { disclaimersectionpara } from './disclaimersectionpara';

export interface disclaimer
{
    id:string;
    disclaimerText: string;
  section1: disclaimersectionpara[];
  section2: disclaimersectionpara[];
  section3: disclaimersectionpara[];
}
