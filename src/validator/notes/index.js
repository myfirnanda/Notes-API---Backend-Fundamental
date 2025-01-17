const InVariantError = require("../../exceptions/InVariantError");
const { NotePayloadSchema } = require("./schema");

const NotesValidator = {
  validateNotePayload: payload => {
    const validationResult = NotePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InVariantError(validationResult.error.message);
    }
  }
};

module.exports = NotesValidator;
