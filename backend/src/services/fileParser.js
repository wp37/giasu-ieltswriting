const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const fileParser = {
  async parseFile(file) {
    const { mimetype, buffer } = file;

    switch (mimetype) {
      case 'text/plain':
        return buffer.toString('utf-8');

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await this.parseDocx(buffer);

      case 'application/pdf':
        return await this.parsePdf(buffer);

      default:
        throw new Error(`Unsupported file type: ${mimetype}`);
    }
  },

  async parseDocx(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
  },

  async parsePdf(buffer) {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }
};

module.exports = fileParser;
