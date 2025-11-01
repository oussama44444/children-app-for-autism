import { useState } from 'react';
import AudioUploader from './AudioUploader';

export default function StoryForm({ story = null, onSubmit, onCancel }) {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [formData, setFormData] = useState({
    title: story?.title || { fr: '', tn: '' },
    image: story?.image || null,
    availableLanguages: story?.availableLanguages || ['fr'],
    stages: story?.stages || [
      {
        segments: [
          {
            audio: { fr: '', tn: '' },
            question: {
              question: { fr: '', tn: '' },
              answers: [
                { text: { fr: '', tn: '' }, correct: true },
                { text: { fr: '', tn: '' }, correct: false },
                { text: { fr: '', tn: '' }, correct: false }
              ],
              hint: { fr: '', tn: '' }
            }
          }
        ]
      }
    ]
  });

  // Language Management Component
  const LanguageManager = () => {
    const hasFrench = formData.availableLanguages.includes('fr');
    const hasTunisian = formData.availableLanguages.includes('tn');

    const toggleLanguage = (lang) => {
      const newAvailableLanguages = formData.availableLanguages.includes(lang)
        ? formData.availableLanguages.filter(l => l !== lang)
        : [...formData.availableLanguages, lang];
      
      updateField('availableLanguages', newAvailableLanguages);
      
      if (!newAvailableLanguages.includes(currentLanguage) && newAvailableLanguages.length > 0) {
        setCurrentLanguage(newAvailableLanguages[0]);
      }
    };

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Story Languages *
        </label>
        <div className="flex flex-col xs:flex-row gap-3 mb-3">
          <button
            type="button"
            onClick={() => toggleLanguage('fr')}
            className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-medium text-base sm:text-lg flex items-center justify-center space-x-2 ${
              hasFrench 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-transparent'
            }`}
          >
            <span>🇫🇷</span>
            <span>French</span>
            {hasFrench && (
              <span className="text-xs sm:text-sm bg-blue-600 px-2 py-1 rounded">Active</span>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => toggleLanguage('tn')}
            className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-medium text-base sm:text-lg flex items-center justify-center space-x-2 ${
              hasTunisian 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-transparent'
            }`}
          >
            <span>🇹🇳</span>
            <span>Tunisian</span>
            {hasTunisian && (
              <span className="text-xs sm:text-sm bg-red-600 px-2 py-1 rounded">Active</span>
            )}
          </button>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          {hasFrench && hasTunisian && (
            <p className="text-green-600 font-medium">✅ This story will be available in both French and Tunisian</p>
          )}
          {hasFrench && !hasTunisian && (
            <p className="text-blue-600">🇫🇷 This story will only be available in French</p>
          )}
          {hasTunisian && !hasFrench && (
            <p className="text-red-600">🇹🇳 This story will only be available in Tunisian</p>
          )}
          {!hasFrench && !hasTunisian && (
            <p className="text-red-500">⚠️ Please select at least one language</p>
          )}
        </div>
      </div>
    );
  };

  // Language tabs for content editing
  const LanguageTabs = () => {
    const hasFrench = formData.availableLanguages.includes('fr');
    const hasTunisian = formData.availableLanguages.includes('tn');

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {hasFrench && (
          <button
            type="button"
            onClick={() => setCurrentLanguage('fr')}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base ${
              currentLanguage === 'fr' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇫🇷 Edit French
          </button>
        )}
        {hasTunisian && (
          <button
            type="button"
            onClick={() => setCurrentLanguage('tn')}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base ${
              currentLanguage === 'tn' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🇹🇳 Edit Tunisian
          </button>
        )}
        {!hasFrench && !hasTunisian && (
          <p className="text-red-500 text-sm py-2">Please select languages above</p>
        )}
      </div>
    );
  };

  const prepareDataForBackend = (data) => {
    console.log('🔄 Preparing data for backend...');
    
    const preparedData = {
      title: data.title,
      image: data.image,
      availableLanguages: data.availableLanguages,
      stages: data.stages.map((stage, stageIndex) => ({
        segments: stage.segments.map((segment, segmentIndex) => {
          const validatedSegment = {
            audio: segment.audio,
            question: {
              question: segment.question.question,
              answers: segment.question.answers.map((answer, answerIndex) => ({
                text: answer.text,
                correct: answer.correct !== undefined ? answer.correct : (answerIndex === 0)
              })),
              hint: segment.question.hint
            }
          };

          return validatedSegment;
        })
      }))
    };

    return preparedData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const preparedData = prepareDataForBackend(formData);
    
    let validationErrors = [];
    
    if (formData.availableLanguages.length === 0) {
      validationErrors.push('Please select at least one language for the story');
    }
    
    formData.availableLanguages.forEach(lang => {
      if (!preparedData.title[lang]?.trim()) {
        validationErrors.push(`${lang === 'fr' ? 'French' : 'Tunisian'} title is required`);
      }
      
      preparedData.stages.forEach((stage, stageIndex) => {
        stage.segments.forEach((segment, segmentIndex) => {
          if (!segment.audio[lang]?.trim()) {
            validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: ${lang === 'fr' ? 'French' : 'Tunisian'} audio is required`);
          }
          
          if (!segment.question.question[lang]?.trim()) {
            validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: ${lang === 'fr' ? 'French' : 'Tunisian'} question is required`);
          }
          
          segment.question.answers.forEach((answer, answerIndex) => {
            if (!answer.text[lang]?.trim()) {
              validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}, Answer ${answerIndex + 1}: ${lang === 'fr' ? 'French' : 'Tunisian'} answer text is required`);
            }
          });
        });
      });
    });

    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      return;
    }

    console.log('✅ All validation passed, submitting data...');
    onSubmit(preparedData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const updateField = (path, value, lang = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (lang && typeof current[lastKey] === 'object' && current[lastKey] !== null) {
        current[lastKey][lang] = value;
      } else {
        current[lastKey] = value;
      }
      
      return newData;
    });
  };

  const addStage = () => {
    setFormData(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          segments: [
            {
              audio: { fr: '', tn: '' },
              question: {
                question: { fr: '', tn: '' },
                answers: [
                  { text: { fr: '', tn: '' }, correct: true },
                  { text: { fr: '', tn: '' }, correct: false },
                  { text: { fr: '', tn: '' }, correct: false }
                ],
                hint: { fr: '', tn: '' }
              }
            }
          ]
        }
      ]
    }));
  };

  const removeStage = (stageIndex) => {
    if (formData.stages.length <= 1) {
      alert('Story must have at least one stage');
      return;
    }
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, index) => index !== stageIndex)
    }));
  };

  const addSegment = (stageIndex) => {
    const updatedStages = [...formData.stages];
    updatedStages[stageIndex].segments.push({
      audio: { fr: '', tn: '' },
      question: {
        question: { fr: '', tn: '' },
        answers: [
          { text: { fr: '', tn: '' }, correct: true },
          { text: { fr: '', tn: '' }, correct: false },
          { text: { fr: '', tn: '' }, correct: false }
        ],
        hint: { fr: '', tn: '' }
      }
    });
    setFormData(prev => ({ ...prev, stages: updatedStages }));
  };

  const removeSegment = (stageIndex, segmentIndex) => {
    const updatedStages = [...formData.stages];
    if (updatedStages[stageIndex].segments.length <= 1) {
      alert('Stage must have at least one segment');
      return;
    }
    updatedStages[stageIndex].segments = updatedStages[stageIndex].segments.filter(
      (_, index) => index !== segmentIndex
    );
    setFormData(prev => ({ ...prev, stages: updatedStages }));
  };

  const hasImage = () => {
    return formData.image && (
      typeof formData.image === 'string' || 
      formData.image instanceof File
    );
  };

  const isLanguageActive = (lang) => formData.availableLanguages.includes(lang);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {story ? 'Edit Story' : 'Create New Story'}
        </h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          {story 
            ? `Edit story content - ${formData.availableLanguages.length} language(s) available` 
            : 'Create a story - choose one or both languages'
          }
        </p>
        
        <LanguageManager />
      </div>

      <LanguageTabs />

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Title {currentLanguage === 'fr' ? '(French)' : '(Tunisian)'} 
            {isLanguageActive(currentLanguage) && ' *'}
          </label>
          <input
            type="text"
            value={formData.title[currentLanguage] || ''}
            onChange={(e) => updateField('title', e.target.value, currentLanguage)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm sm:text-base"
            placeholder={currentLanguage === 'fr' ? "Enter French title..." : "أدخل العنوان باللهجة التونسية..."}
            required={isLanguageActive(currentLanguage)}
          />
          {isLanguageActive(currentLanguage) && !formData.title[currentLanguage] && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">⚠️ Title is required for {currentLanguage === 'fr' ? 'French' : 'Tunisian'} version</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Image {!story && '*'}
          </label>
          
          {story && formData.image && typeof formData.image === 'string' && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <img 
                src={formData.image} 
                alt="Current story" 
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border shadow-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-xs sm:text-sm text-gray-500 file:mr-2 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!story}
          />
        </div>
      </div>

      {/* Stages & Segments */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Stages & Segments</h3>
            <p className="text-sm text-gray-600">Add interactive stages with audio and questions</p>
          </div>
          <button
            type="button"
            onClick={addStage}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <span>+</span>
            <span>Add Stage</span>
          </button>
        </div>

        {formData.stages.map((stage, stageIndex) => (
          <div key={stageIndex} className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700">Stage {stageIndex + 1}</h4>
                <p className="text-sm text-gray-500">
                  {stage.segments.length} segment{stage.segments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addSegment(stageIndex)}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-xs sm:text-sm font-medium flex-1 sm:flex-none"
                >
                  + Add Segment
                </button>
                <button
                  type="button"
                  onClick={() => removeStage(stageIndex)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-xs sm:text-sm font-medium flex-1 sm:flex-none"
                  disabled={formData.stages.length <= 1}
                >
                  Remove Stage
                </button>
              </div>
            </div>

            {stage.segments.map((segment, segmentIndex) => (
              <div key={segmentIndex} className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h5 className="text-md font-medium text-gray-700">
                    Segment {segmentIndex + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeSegment(stageIndex, segmentIndex)}
                    className="bg-red-400 text-white px-3 py-1 rounded-lg hover:bg-red-500 text-xs sm:text-sm font-medium w-full sm:w-auto"
                    disabled={stage.segments.length <= 1}
                  >
                    Remove Segment
                  </button>
                </div>

                {/* Audio Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio File {currentLanguage === 'fr' ? '(French)' : '(Tunisian)'} 
                    {isLanguageActive(currentLanguage) && ' *'}
                  </label>
                  <AudioUploader
                    existingAudio={segment.audio[currentLanguage]}
                    onAudioUploaded={(url) => updateField(`stages.${stageIndex}.segments.${segmentIndex}.audio`, url, currentLanguage)}
                  />
                  {isLanguageActive(currentLanguage) && !segment.audio[currentLanguage] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">⚠️ Audio is required for {currentLanguage === 'fr' ? 'French' : 'Tunisian'} version</p>
                  )}
                </div>

                {/* Question */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question {currentLanguage === 'fr' ? '(French)' : '(Tunisian)'} 
                    {isLanguageActive(currentLanguage) && ' *'}
                  </label>
                  <input
                    type="text"
                    value={segment.question.question[currentLanguage] || ''}
                    onChange={(e) => updateField(`stages.${stageIndex}.segments.${segmentIndex}.question.question`, e.target.value, currentLanguage)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm sm:text-base"
                    placeholder={currentLanguage === 'fr' ? "Enter the question in French..." : "أدخل السؤال باللهجة التونسية..."}
                    required={isLanguageActive(currentLanguage)}
                  />
                  {isLanguageActive(currentLanguage) && !segment.question.question[currentLanguage] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">⚠️ Question is required for {currentLanguage === 'fr' ? 'French' : 'Tunisian'} version</p>
                  )}
                </div>

                {/* Hint */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hint {currentLanguage === 'fr' ? '(French)' : '(Tunisian)'} (Optional)
                  </label>
                  <input
                    type="text"
                    value={segment.question.hint[currentLanguage] || ''}
                    onChange={(e) => updateField(`stages.${stageIndex}.segments.${segmentIndex}.question.hint`, e.target.value, currentLanguage)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm sm:text-base"
                    placeholder={currentLanguage === 'fr' ? "Enter a hint in French..." : "أدخل تلميح باللهجة التونسية..."}
                  />
                </div>

                {/* Answers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Answers {currentLanguage === 'fr' ? '(French)' : '(Tunisian)'} 
                    {isLanguageActive(currentLanguage) && ' *'} (Mark one as correct)
                  </label>
                  <div className="space-y-3">
                    {segment.question.answers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <input
                          type="text"
                          value={answer.text[currentLanguage] || ''}
                          onChange={(e) => updateField(`stages.${stageIndex}.segments.${segmentIndex}.question.answers.${answerIndex}.text`, e.target.value, currentLanguage)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm sm:text-base"
                          placeholder={currentLanguage === 'fr' ? `Answer ${answerIndex + 1} in French...` : `الجواب ${answerIndex + 1} باللهجة التونسية...`}
                          required={isLanguageActive(currentLanguage)}
                        />
                        <label className="flex items-center space-x-2 cursor-pointer min-w-[100px]">
                          <input
                            type="radio"
                            name={`correct-${stageIndex}-${segmentIndex}`}
                            checked={answer.correct}
                            onChange={() => {
                              segment.question.answers.forEach((_, idx) => {
                                updateField(`stages.${stageIndex}.segments.${segmentIndex}.question.answers.${idx}.correct`, false);
                              });
                              updateField(`stages.${stageIndex}.segments.${segmentIndex}.question.answers.${answerIndex}.correct`, true);
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Correct</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium order-1 sm:order-2"
        >
          {story ? 'Update Story' : 'Create Story'}
        </button>
      </div>
    </form>
  );
}