import { generateLegalDraft } from '../services/documents/draftGenerator.js';

export async function generateDraft(req, res) {
  try {
    const { templateType, formData } = req.body;

    if (!templateType) {
      return res.status(400).json({ success: false, message: 'templateType required.' });
    }

    const draft = generateLegalDraft(templateType, formData || {});

    return res.json({
      success: true,
      draft
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
