
export interface Card {
  id: string;
  quiz_id: string;
  c_text: string;
  c_subtext: string;
  c_image: string;
  c_audio: string;
  c_video: string;
  c_atype: string;
  c_correct: string;
  c_study: string;
  c_substudy: string;
  c_viewalist: any[];
  c_viewacorrect: number;
  smalltext: boolean;
}
