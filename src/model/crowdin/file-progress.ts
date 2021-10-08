import { TranslationStatusModel } from '@crowdin/crowdin-api-client/out/translationStatus';

export interface FileProgress {
  [fileId: number]: TranslationStatusModel.LanguageProgress[];
}
