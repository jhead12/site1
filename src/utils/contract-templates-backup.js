/**
 * Contract Templates for AI Contract Designer
 * These templates serve as the foundation for generating custom contracts
 * based on user responses and copyright ownership levels.
 */

export const contractTemplates = {
  // Non-Exclusive License Template
  non_exclusive: {
    title: "NON-EXCLUSIVE MUSIC LICENSE AGREEMENT",
    description: "Standard license allowing commercial use while producer retains ownership rights",
    template: `
NON-EXCLUSIVE MUSIC LICENSE AGREEMENT

This Agreement is entered into on {DATE} between:

LICENSOR: J. Eldon Music
Address: [Producer Address]
Email: [Producer Email]

LICENSEE: {CLIENT_NAME}
Address: {CLIENT_ADDRESS}
Email: {CLIENT_EMAIL}

1. GRANT OF LICENSE
Licensor grants Licensee a non-exclusive license to use the musical composition titled "{TRACK_TITLE}" (the "Beat") subject to the terms and conditions set forth below.

2. PERMITTED USES
Licensee may use the Beat for:
{COMMERCIAL_USE_LIST}

3. RESTRICTIONS
- Licensee may NOT claim ownership of the Beat
- Licensee may NOT resell, redistribute, or sublicense the Beat
- Licensee may NOT use the Beat for any unlawful purposes
- Credit must be given to Licensor as: "Produced by J. Eldon Music"

4. PAYMENT TERMS
Total License Fee: ${FINAL_PRICE}
Payment Method: {PAYMENT_METHOD}
Payment Date: {PAYMENT_DATE}

5. DELIVERABLES
Licensor will provide:
{DELIVERABLES_LIST}

6. TIMELINE
Delivery within: {TIMELINE}
Revisions included: {REVISIONS}

7. COPYRIGHT
Licensor retains all rights, title, and interest in the Beat. This license does not constitute a transfer of copyright ownership.

8. TERMINATION
This license is perpetual unless terminated for breach of terms.

9. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

LICENSOR: J. Eldon Music          LICENSEE: {CLIENT_NAME}
Signature: ________________       Signature: ________________
Date: ________________           Date: ________________
    `,
    variables: [
      'DATE', 'CLIENT_NAME', 'CLIENT_ADDRESS', 'CLIENT_EMAIL', 
      'TRACK_TITLE', 'COMMERCIAL_USE_LIST', 'FINAL_PRICE', 
      'PAYMENT_METHOD', 'PAYMENT_DATE', 'DELIVERABLES_LIST', 
      'TIMELINE', 'REVISIONS'
    ]
  },

  // Exclusive License Template
  exclusive: {
    title: "EXCLUSIVE MUSIC LICENSE AGREEMENT",
    description: "Exclusive license granting sole commercial rights to the licensee",
    template: `
EXCLUSIVE MUSIC LICENSE AGREEMENT

This Agreement is entered into on {DATE} between:

LICENSOR: J. Eldon Music
Address: [Producer Address]
Email: [Producer Email]

LICENSEE: {CLIENT_NAME}
Address: {CLIENT_ADDRESS}
Email: {CLIENT_EMAIL}

1. GRANT OF EXCLUSIVE LICENSE
Licensor grants Licensee an EXCLUSIVE license to use the musical composition titled "{TRACK_TITLE}" (the "Beat"). This exclusive license means that Licensor will not license the Beat to any other party.

2. PERMITTED USES
Licensee has exclusive rights to use the Beat for:
{COMMERCIAL_USE_LIST}

3. EXCLUSIVITY TERMS
- Licensee is the ONLY party authorized to use this Beat commercially
- Licensor will remove the Beat from all marketplaces and promotional materials
- Licensor will not license the Beat to any other party
- Credit must be given to Licensor as: "Produced by J. Eldon Music"

4. PAYMENT TERMS
Total License Fee: ${FINAL_PRICE}
Payment Method: {PAYMENT_METHOD}
Payment Date: {PAYMENT_DATE}

5. DELIVERABLES
Licensor will provide:
{DELIVERABLES_LIST}

6. TIMELINE AND REVISIONS
Delivery within: {TIMELINE}
Revisions included: {REVISIONS}

7. COPYRIGHT
Licensor retains copyright ownership of the Beat, but grants exclusive usage rights to Licensee.

8. TERRITORY
This exclusive license applies worldwide in all territories.

9. TERM
This exclusive license is perpetual unless terminated for breach of terms.

10. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

LICENSOR: J. Eldon Music          LICENSEE: {CLIENT_NAME}
Signature: ________________       Signature: ________________
Date: ________________           Date: ________________
    `,
    variables: [
      'DATE', 'CLIENT_NAME', 'CLIENT_ADDRESS', 'CLIENT_EMAIL', 
      'TRACK_TITLE', 'COMMERCIAL_USE_LIST', 'FINAL_PRICE', 
      'PAYMENT_METHOD', 'PAYMENT_DATE', 'DELIVERABLES_LIST', 
      'TIMELINE', 'REVISIONS'
    ]
  },

  // Complete Buyout Template
  buyout: {
    title: "COMPLETE MUSIC RIGHTS TRANSFER AGREEMENT",
    description: "Full ownership transfer including all rights and future royalties",
    template: `
COMPLETE MUSIC RIGHTS TRANSFER AGREEMENT

This Agreement is entered into on {DATE} between:

ASSIGNOR: J. Eldon Music
Address: [Producer Address]
Email: [Producer Email]

ASSIGNEE: {CLIENT_NAME}
Address: {CLIENT_ADDRESS}
Email: {CLIENT_EMAIL}

1. TRANSFER OF OWNERSHIP
Assignor hereby transfers, assigns, and conveys to Assignee ALL right, title, and interest in and to the musical composition titled "{TRACK_TITLE}" (the "Work"), including but not limited to:
- All copyright ownership
- All publishing rights
- All master recording rights
- All synchronization rights
- All mechanical rights
- All performance rights
- All derivative work rights

2. COMPLETE BUYOUT TERMS
- Assignee becomes the sole owner of the Work
- Assignee may use the Work for any purpose without restriction
- Assignee may license the Work to third parties
- Assignee may modify, adapt, or create derivative works
- Assignee may collect all royalties and revenues
- Credit to Assignor is optional but appreciated

3. PAYMENT TERMS
Total Buyout Price: ${FINAL_PRICE}
Payment Method: {PAYMENT_METHOD}
Payment Date: {PAYMENT_DATE}

4. DELIVERABLES
Assignor will provide:
{DELIVERABLES_LIST}

5. TIMELINE AND REVISIONS
Delivery within: {TIMELINE}
Revisions included: {REVISIONS}

6. REPRESENTATIONS AND WARRANTIES
Assignor represents and warrants that:
- The Work is original and does not infringe upon any third party rights
- Assignor has full power and authority to transfer the Work
- The Work is free from any liens, encumbrances, or claims

7. ROYALTY WAIVER
Assignor waives any and all rights to future royalties, revenues, or other compensation from the Work.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

ASSIGNOR: J. Eldon Music          ASSIGNEE: {CLIENT_NAME}
Signature: ________________       Signature: ________________
Date: ________________           Date: ________________
    `,
    variables: [
      'DATE', 'CLIENT_NAME', 'CLIENT_ADDRESS', 'CLIENT_EMAIL', 
      'TRACK_TITLE', 'FINAL_PRICE', 'PAYMENT_METHOD', 'PAYMENT_DATE', 
      'DELIVERABLES_LIST', 'TIMELINE', 'REVISIONS'
    ]
  },

  // Co-Ownership Template
  co_ownership: {
    title: "MUSIC CO-OWNERSHIP AGREEMENT",
    description: "Joint ownership with shared rights and revenue split",
    template: `
MUSIC CO-OWNERSHIP AGREEMENT

This Agreement is entered into on {DATE} between:

PARTY A: J. Eldon Music
Address: [Producer Address]
Email: [Producer Email]

PARTY B: {CLIENT_NAME}
Address: {CLIENT_ADDRESS}
Email: {CLIENT_EMAIL}

1. CO-OWNERSHIP STRUCTURE
The parties agree to co-own the musical composition titled "{TRACK_TITLE}" (the "Work") with the following ownership percentages:
- Party A (J. Eldon Music): 50%
- Party B ({CLIENT_NAME}): 50%

2. RIGHTS AND RESPONSIBILITIES
Each party has the right to:
- Use the Work for their own commercial purposes
- License the Work to third parties (with consent of the other party)
- Receive their proportional share of all revenues
- Be credited as co-owner in all uses

3. REVENUE SHARING
All revenues from the Work shall be split:
- Party A: 50%
- Party B: 50%

This includes:
- Streaming royalties
- Licensing fees
- Synchronization fees
- Performance royalties
- Any other revenue streams

4. PAYMENT TERMS
Initial Investment by Party B: ${FINAL_PRICE}
Payment Method: {PAYMENT_METHOD}
Payment Date: {PAYMENT_DATE}

5. DELIVERABLES
Party A will provide:
{DELIVERABLES_LIST}

6. TIMELINE AND REVISIONS
Delivery within: {TIMELINE}
Revisions included: {REVISIONS}

7. DECISION MAKING
Major decisions regarding the Work require mutual consent of both parties, including:
- Licensing to third parties
- Significant modifications to the Work
- Legal actions regarding the Work

8. CREDIT REQUIREMENTS
All uses of the Work must credit both parties:
"Produced by J. Eldon Music & {CLIENT_NAME}"

9. TERMINATION
This co-ownership agreement is perpetual unless both parties agree to termination in writing.

10. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

PARTY A: J. Eldon Music          PARTY B: {CLIENT_NAME}
Signature: ________________       Signature: ________________
Date: ________________           Date: ________________
    `,
    variables: [
      'DATE', 'CLIENT_NAME', 'CLIENT_ADDRESS', 'CLIENT_EMAIL', 
      'TRACK_TITLE', 'FINAL_PRICE', 'PAYMENT_METHOD', 'PAYMENT_DATE', 
      'DELIVERABLES_LIST', 'TIMELINE', 'REVISIONS'
    ]
  },

  // Comprehensive Producer Agreement Template (Work for Hire)
  producer_agreement: {
    title: "PRODUCER AGREEMENT TEMPLATE (NO ROYALTY/SONG RIGHTS)",
    description: "Comprehensive work-for-hire producer agreement with detailed terms and conditions",
    disclaimer: "Users of this template are advised to do their own due diligence when it comes to making business decisions and all information, products or services that have been provided should be independently verified by your own qualified professionals. By reading or using this guide, you agree that the author and authors company are not responsible for the success or failure or your business decisions relating to any information presented in this guide. There are no warranties or representation that these products are fit for a particular use. Since contracts are governed by the laws of different states, provinces, and countries you understand that SmartBandManagement.com makes no warranties for use of these contracts under any particular laws and that SmartBandManagement.com has advised you to seek out an attorney to make sure these contracts conform for your use.",
    template: `
PRODUCER AGREEMENT TEMPLATE (NO ROYALTY/SONG RIGHTS)

The following shall constitute an Agreement ("Agreement") on this the {CONTRACT_DATE} day of {CONTRACT_MONTH}, {CONTRACT_YEAR}, between {CLIENT_NAME} ("Employer") and J. Eldon Music ("Producer") for Producer's services as a producer of master recordings to be owned by Employer. The terms of this Agreement are as follows:

1. ENGAGEMENT: Producer shall perform Audio Product production services and produce a Master for inclusion, at Employer's election, on an Audio Product of the artist known as {ARTIST_NAME} ("Artist"). Production of the Master shall take place at dates and times to be mutually agreed upon by Employer and Producer.

2. RECORDING PROCEDURE: Recording sessions for the Master will be conducted by Employer at Employer's sole cost and expense. Employer shall pay all Recording Costs of the Masters recorded hereunder as and when due. Producer shall deliver to Employer upon completion, a fully mixed, edited, and equalized Master, in a format to be mutually agreed to by the parties, commercially satisfactory to Employer for use on an Audio Product and all original and duplicate Masters of the music, lyrics and all other material recorded. Producer shall act diligently in completion of the Master. All songs recorded hereunder shall be listed and attached to this Agreement as Schedule "A" List Of Songs.

3. COMPENSATION: Employer shall pay Producer the following for Producer's services listed in this Agreement:
   (a) A payment of {PAYMENT_AMOUNT_WORDS} No/100's Dollars (${FINAL_PRICE}) per song or track to be created, produced and recorded by Producer.

4. RIGHTS IN RECORDING: Each Master made under this Agreement, from the inception of recording, will be considered a work made for hire for Employer, if any such Master is deemed not to be a work made for hire, all rights, title and interest in the Master which are attributable to the Producer's participation in its authorship will be deemed transferred to Employer by this Agreement and this Agreement may be filed with the Register of Copyright as an official transfer of copyright if such be necessary. All Masters made under this Agreement, from the inception of recording and Audio Products derived therefrom, shall be the sole property of Employer, free from any claims whatsoever by Producer or any other person; and Employer shall have the exclusive right to claim ownership of and register the copyright to those Masters in his name as the owner and author of them and to secure any and all renewals and extensions of such copyright throughout the world.

5. NAMES & LIKENESS: Employer shall have the world wide right in perpetuity to use and to permit others to use Producer's name, (both legal and professional, and whether presently or hereafter used by the Producer), likeness, other identification, and biographical material concerning the Producer for purposes of trade and otherwise without restriction in connection with the Masters recorded hereunder, the Audio Products derived therefrom.

6. CREDIT: Employer shall give Producer appropriate production and songwriting credit on all compact discs, record and cassette labels or any other record configuration manufactured which is now known or created in the future that embodies the Masters created hereunder, and on all cover liner notes. Such credit shall be in substantial form: "Produced by J. Eldon Music." If Employer fails to comply with this clause in any instances the sole obligation of Employer to Producer by reason of such failure shall be for Employer to use Employer's best efforts to rectify the error in all such materials prepared after Employer's receipt of notice of this failure by Employer. No inadvertent failure by Employer to satisfy the credit obligation set forth herein shall be deemed a breach of this Agreement.

7. MUSICAL COMPOSITIONS ("Songs"): Producer shall be considered the author of the music recorded on the Masters recorded hereunder which are written or composed by Producer, in whole or in part, alone or in collaboration with Employer or with others. Such ownership percentage shall be accorded to Producer in accordance with Producer's percentage of authorship based on the copyright laws of the United States and as set forth on Schedule "A" attached hereto. Appropriate credit as a song writer and author of the music showing author's performance right society affiliation shall be given to Producer based on the songs produced and created under this Agreement. If Producer is the sole writer of the music produced under this Agreement, then Producer shall have the right to prepare and file copyright registration forms for the music produced under this Agreement. Producer shall provide Employer with a copy of the filed registration form upon receipt by Producer of the filed form from the Copyright Office. Employer shall have the right to incorporate lyrics with the music created hereunder to create a new song ("New Song") and Employer shall have the right to give the New Song a new title and register the New Song for copyright, providing Producer the copyright credit in the music in the New Song as set forth in this Agreement. Producer shall have sole administration rights to the music created under this Agreement. Producer shall not have the right to sell, assign or license the music for use as part of a song other than in the New Song to any third party without the written consent of Employer.

8. MECHANICAL LICENSING AND ROYALTIES:
   (a) All musical compositions or material recorded pursuant to this Agreement, which are written or composed, in whole or in part, or owned or controlled directly or indirectly by Producer (herein "Controlled Compositions"), shall be and are hereby perpetually licensed to Employer for the United States and Canada at a royalty per selection equal to Seventy-five (75%) percent of the mechanical statutory per selection rate (with regard to playing time) effective on the date of initial U.S. commercial release of the masters concerned hereinafter sometimes to be referred to as the "Per Selection Rate." Notwithstanding the foregoing, with respect to foreign sales, the royalty per selection shall be equal to Seventy-five (75%) percent of the minimum statutory mechanical royalty rate as established by the mechanical rights society having jurisdiction over the territory in which records are manufactured.
   
   (b) Notwithstanding the foregoing, all mechanical royalties payable to Producer hereunder shall be paid on the basis of net records sold and shall be calculated and payable on the same basis which royalties are calculated and payable to Artist pursuant to Artist's Recording Agreement with Artist's Record Company that releases the Masters of Songs produced under this Agreement including but not limited to any and all reductions for foreign mechanical royalties, controlled compositions, premiums, promotional, free goods, etc.
   
   (c) Employer shall account to Producer, on a semi-annual basis and pay royalties to Producer, if any, within thirty (30) days of the end of each semi-annual period beginning December 31 and June 30. Employer shall send such accounting with payment, if any, to Producer at Producer's address listed below. In the event Producer's address changes, Employer shall have no obligation to send the accounting and royalty payment to any other address until Producer shall give to Employer in writing such new address.

9. DEFINITIONS:
   "Audio Products" shall mean and include without limitation all forms of recording and record reproduction by which sound may be fixed, embodied, or recorded by any method now known or later developed, for any and all public or commercial uses including magnetic recording tape, compact disc, digital formats, digital transmissions. laser disc, film, electronic video tapes or recordings, and any other medium or device now known or later developed.
   
   "Digital Format" shall mean the format of the Masters other than a physical configuration typically created in a computer file format (e.g. MP3, WAV, etc. ) that are distributed and sold to Consumers by Electronic Transmission.
   
   "Electronic Transmissions" shall mean the transmission and distribution to the consumer, other than the distribution of physical Audio Products to consumers, whether of sound alone, sound coupled with an image or sound coupled with data, in any form including but not limited to the downloading or other conveyance of Artist's performance on Masters, Digital Formats or audiovisual recordings recorded hereunder by telephone, satellite, cable, direct transmission over wire or through the air, and on-line computers whether a direct or indirect charge is made to receive the transmission.
   
   "Master" shall mean every recording of sound, whether or not coupled with a visual image, by any method and on any substance or material, whether now or hereafter known, which is used or useful in the recording production and/or manufacture of Records.
   
   "Recording Costs" shall mean all direct expenses paid or incurred by Employer in connection with the production, mixing and mastering of the Master including but not limited to studio rentals, tape, engineering, editing, instrument rental, and mastering, any per diems of any other person rendering services in connection with the recording of the Masters.

10. WARRANTIES: Producer hereby warrants that the Master shall be entirely the property of Employer, free of any claims whatsoever by Producer or any person deriving any rights or interest from Producer. Producer warrants it is the sole owner of the performances on the Masters and/or has been granted all rights associated with the recording of the music embodied on the Masters and hereby has the right to grant the terms of this Agreement. The songs and performances embodied in the Recordings, and any use thereof by Employer or its grantees, licensees, or assigns, will not violate or infringe upon the rights of any third party. Producer warrants it has secured all proper licenses for the right to perform and record all or any part of the performances or recording embodied on the Master for the use of a song or recording appearing in the Master from a "sample", an "interpolation" or a "replay." If Producer has not secured such right, then Producer has notified Employer and Employer has agreed in a separate writing to secure such rights. Producer agrees to indemnify and hold harmless Employer, its officers, agents, employees, attorneys and assignees, from and against any and all claims, damages, liabilities, costs and expenses including but not limited to attorney's fees, arising out of any breach of any representation, warranty, term or agreement made or to be performed by this Agreement.

11. ENTIRE AGREEMENT: This Agreement sets forth the entire agreement between the parties with respect to the subject matter hereof. No modification, amendment, waiver, termination or discharge of this Agreement, shall be binding upon either party unless confirmed by a written instrument signed by either party or their agent.

12. JURISDICTION: This agreement shall be construed in accordance with the laws of the State of {STATE}. Any dispute arising under this Agreement shall be filed in a court in {COUNTY} County, {STATE}.

13. INDEPENDENT CONTRACTOR: Producer hereby acknowledges and agrees that Producer's services are being provided hereunder as an independent contractor. Accordingly, and pursuant to Producer request Employer shall not withhold, report or pay withholding taxes with respect to the compensation payable hereunder. "Withholding taxes" shall include, without limitation, federal and state income taxes, federal and state income taxes, federal social security tax, and unemployment insurance tax.

The effective date of this Agreement shall be the date first written above.

Employer:
{CLIENT_NAME}

Address: {CLIENT_ADDRESS}

Producer:
J. Eldon Music

Address: {PRODUCER_ADDRESS}

SCHEDULE A - LIST OF SONGS

Title: "{TRACK_TITLE}"
Owner Of Music: {MUSIC_OWNERSHIP}
Owner of Lyrics: {LYRICS_OWNERSHIP}

{ADDITIONAL_SONGS}
    `,
    fields: [
      { name: 'CLIENT_NAME', label: 'Client/Employer Name', type: 'text', required: true },
      { name: 'CLIENT_ADDRESS', label: 'Client Address', type: 'textarea', required: true },
      { name: 'CLIENT_EMAIL', label: 'Client Email', type: 'email', required: true },
      { name: 'ARTIST_NAME', label: 'Artist Name', type: 'text', required: true },
      { name: 'TRACK_TITLE', label: 'Track/Song Title', type: 'text', required: true },
      { name: 'FINAL_PRICE', label: 'Payment Amount ($)', type: 'number', required: true },
      { name: 'PAYMENT_AMOUNT_WORDS', label: 'Payment Amount (in words)', type: 'text', required: true },
      { name: 'MUSIC_OWNERSHIP', label: 'Music Ownership Details', type: 'text', required: true },
      { name: 'LYRICS_OWNERSHIP', label: 'Lyrics Ownership Details', type: 'text', required: true },
      { name: 'STATE', label: 'Governing State/Province', type: 'text', required: true },
      { name: 'COUNTY', label: 'County for Legal Jurisdiction', type: 'text', required: true },
      { name: 'PRODUCER_ADDRESS', label: 'Producer Address', type: 'textarea', required: true },
      { name: 'ADDITIONAL_SONGS', label: 'Additional Songs (if any)', type: 'textarea', required: false }
    ]
  }
};

/**
 * Generate contract text based on template and user responses
 * @param {String} copyrightLevel - Type of copyright ownership
 * @param {Object} responses - User responses from AI questionnaire
 * @param {Object} contractData - Additional contract data
 * @returns {String} - Generated contract text
 */
export const generateContractText = (copyrightLevel, responses, contractData) => {
  const template = contractTemplates[copyrightLevel];
  if (!template) {
    throw new Error(`No template found for copyright level: ${copyrightLevel}`);
  }

  let contractText = template.template;
  
  // Replace variables with actual values
  const replacements = {
    DATE: new Date().toLocaleDateString(),
    CLIENT_NAME: contractData.clientName || '[CLIENT NAME]',
    CLIENT_ADDRESS: contractData.clientAddress || '[CLIENT ADDRESS]',
    CLIENT_EMAIL: contractData.clientEmail || '[CLIENT EMAIL]',
    TRACK_TITLE: contractData.trackTitle || '[TRACK TITLE]',
    FINAL_PRICE: contractData.finalPrice || 0,
    PAYMENT_METHOD: contractData.paymentMethod || 'Credit Card',
    PAYMENT_DATE: new Date().toLocaleDateString(),
    TIMELINE: getTimelineText(responses.timeline),
    REVISIONS: getRevisionsText(responses.revisions),
    COMMERCIAL_USE_LIST: generateCommercialUseList(responses.commercialUse),
    DELIVERABLES_LIST: generateDeliverablesList(responses.deliverables)
  };

  // Replace all variables in the template
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    contractText = contractText.replace(regex, value);
  });

  return contractText;
};

/**
 * Convert timeline code to human-readable text
 * @param {String} timeline - Timeline code from responses
 * @returns {String} - Human-readable timeline
 */
const getTimelineText = (timeline) => {
  const timelines = {
    'rush_24h': '24 hours (Rush Service)',
    'fast_3days': '3-5 business days',
    'standard_1week': '1-2 weeks',
    'flexible_1month': '1 month (Flexible)'
  };
  return timelines[timeline] || '1-2 weeks';
};

/**
 * Convert revisions code to human-readable text
 * @param {String} revisions - Revisions code from responses
 * @returns {String} - Human-readable revisions
 */
const getRevisionsText = (revisions) => {
  const revisionTexts = {
    'none': 'No revisions included',
    'basic_2': '2 revisions',
    'premium_5': '5 revisions',
    'unlimited': 'Unlimited revisions'
  };
  return revisionTexts[revisions] || '2 revisions';
};

/**
 * Generate commercial use list from responses
 * @param {Array} commercialUse - Array of commercial use codes
 * @returns {String} - Formatted commercial use list
 */
const generateCommercialUseList = (commercialUse) => {
  if (!commercialUse || commercialUse.length === 0) {
    return '- Basic streaming and digital distribution';
  }

  const useTexts = {
    'streaming': '- Streaming platforms (Spotify, Apple Music, etc.)',
    'radio': '- Radio and broadcast',
    'tv_film': '- Television, film, and commercial use',
    'live_performance': '- Live performances and concerts',
    'youtube_monetization': '- YouTube monetization',
    'unlimited': '- Unlimited commercial use'
  };

  return commercialUse.map(use => useTexts[use] || `- ${use}`).join('\n');
};

/**
 * Generate deliverables list from responses
 * @param {Array} deliverables - Array of deliverable codes
 * @returns {String} - Formatted deliverables list
 */
const generateDeliverablesList = (deliverables) => {
  if (!deliverables || deliverables.length === 0) {
    return '- Mixed and mastered track (MP3 and WAV)';
  }

  const deliverableTexts = {
    'mixed_master': '- Mixed and mastered track (MP3 and WAV)',
    'stems': '- Individual stems/tracks',
    'midi_files': '- MIDI files',
    'project_file': '- Original project file',
    'alternate_versions': '- Alternate versions (instrumental, acapella)',
    'custom_edits': '- Custom length edits'
  };

  return deliverables.map(deliverable => deliverableTexts[deliverable] || `- ${deliverable}`).join('\n');
};

/**
 * Get contract template info
 * @param {String} copyrightLevel - Copyright ownership level
 * @returns {Object} - Template info
 */
export const getContractTemplateInfo = (copyrightLevel) => {
  const template = contractTemplates[copyrightLevel];
  if (!template) {
    return null;
  }

  return {
    title: template.title,
    description: template.description,
    variables: template.variables
  };
};

/**
 * Generate contract summary for preview
 * @param {String} copyrightLevel - Copyright ownership level
 * @param {Object} responses - User responses
 * @param {Object} contractData - Contract data
 * @returns {Object} - Contract summary
 */
export const generateContractSummary = (copyrightLevel, responses, contractData) => {
  const template = contractTemplates[copyrightLevel];
  if (!template) {
    return null;
  }

  return {
    title: template.title,
    description: template.description,
    copyrightLevel: copyrightLevel,
    price: contractData.finalPrice,
    timeline: getTimelineText(responses.timeline),
    revisions: getRevisionsText(responses.revisions),
    commercialUse: responses.commercialUse || [],
    deliverables: responses.deliverables || [],
    keyTerms: getKeyTerms(copyrightLevel),
    restrictions: getRestrictions(copyrightLevel)
  };
};

/**
 * Get key terms for each copyright level
 * @param {String} copyrightLevel - Copyright ownership level
 * @returns {Array} - Array of key terms
 */
const getKeyTerms = (copyrightLevel) => {
  const terms = {
    'non_exclusive': [
      'Producer retains ownership',
      'Beat can be licensed to others',
      'Commercial use rights included',
      'Credit required'
    ],
    'exclusive': [
      'Exclusive commercial rights',
      'Beat removed from marketplace',
      'No other licenses granted',
      'Credit required'
    ],
    'buyout': [
      'Complete ownership transfer',
      'Full copyright ownership',
      'Can resell or relicense',
      'No credit required'
    ],
    'co_ownership': [
      '50/50 ownership split',
      'Shared revenue streams',
      'Joint decision making',
      'Both parties credited'
    ],
    'producer_agreement': [
      'Work for hire - no ownership rights',
      'Producer paid per track',
      'All rights transferred to employer',
      'Credit required'
    ]
  };

  return terms[copyrightLevel] || [];
};

/**
 * Get restrictions for each copyright level
 * @param {String} copyrightLevel - Copyright ownership level
 * @returns {Array} - Array of restrictions
 */
const getRestrictions = (copyrightLevel) => {
  const restrictions = {
    'non_exclusive': [
      'Cannot claim ownership',
      'Cannot resell the beat',
      'Must credit producer',
      'Cannot prevent other licenses'
    ],
    'exclusive': [
      'Cannot resell the beat',
      'Must credit producer',
      'Cannot transfer license without consent'
    ],
    'buyout': [
      'No restrictions - full ownership'
    ],
    'co_ownership': [
      'Major decisions require consent',
      'Cannot sell without partner approval',
      'Must credit both parties'
    ],
    'producer_agreement': [
      'No ownership rights for producer',
      'All sales final - no refunds',
      'Producer cannot claim royalties',
      'Credit must be given to producer'
    ]
  };

  return restrictions[copyrightLevel] || [];
};

/**
 * Generate contract content from template and form data
 */
export const generateContractFromTemplate = (templateKey, formData) => {
  const template = contractTemplates[templateKey];
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`);
  }

  let content = template.template;
  
  // Current date variables
  const now = new Date();
  const contractDate = now.getDate();
  const contractMonth = now.toLocaleString('default', { month: 'long' });
  const contractYear = now.getFullYear();
  
  // Standard replacements for all contracts
  const replacements = {
    DATE: now.toLocaleDateString(),
    CONTRACT_DATE: contractDate.toString(),
    CONTRACT_MONTH: contractMonth,
    CONTRACT_YEAR: contractYear.toString(),
    CLIENT_NAME: formData.partnerName || formData.clientName || '',
    CLIENT_ADDRESS: formData.clientAddress || '',
    CLIENT_EMAIL: formData.partnerEmail || formData.clientEmail || '',
    FINAL_PRICE: formData.finalPrice || formData.revenueShare || '',
    PAYMENT_METHOD: formData.paymentMethod || 'Automatic (PayPal)',
    PAYMENT_DATE: now.toLocaleDateString(),
    TIMELINE: formData.timeline || '7-14 business days',
    REVISIONS: formData.revisions || '3 revisions included'
  };

  // Producer Agreement specific replacements
  if (templateKey === 'producer_agreement') {
    Object.assign(replacements, {
      ARTIST_NAME: formData.artistName || '',
      TRACK_TITLE: formData.trackTitle || '',
      PAYMENT_AMOUNT_WORDS: formData.paymentAmountWords || '',
      MUSIC_OWNERSHIP: formData.musicOwnership || 'J. Eldon Music (100%)',
      LYRICS_OWNERSHIP: formData.lyricsOwnership || 'To Be Determined',
      STATE: formData.governingState || '',
      COUNTY: formData.county || '',
      PRODUCER_ADDRESS: formData.producerAddress || '',
      ADDITIONAL_SONGS: formData.additionalSongs || ''
    });
  }

  // Replace all placeholders in the template
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{${key}}`, 'g');
    content = content.replace(regex, value);
  }

  return {
    title: template.title,
    content: content,
    disclaimer: template.disclaimer || null,
    fields: template.fields || []
  };
};

/**
 * Get available contract templates with their metadata
 */
export const getAvailableTemplates = () => {
  return Object.entries(contractTemplates).map(([key, template]) => ({
    key,
    title: template.title,
    description: template.description,
    hasDisclaimer: !!template.disclaimer,
    fieldCount: template.fields ? template.fields.length : 0
  }));
};

/**
 * Validate contract form data based on template requirements
 */
export const validateContractData = (templateKey, formData) => {
  const template = contractTemplates[templateKey];
  if (!template || !template.fields) {
    return { isValid: true, errors: [] };
  }

  const errors = [];
  
  template.fields.forEach(field => {
    if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
      errors.push(`${field.label} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  contractTemplates,
  generateContractText,
  getContractTemplateInfo,
  generateContractSummary,
  generateContractFromTemplate,
  getAvailableTemplates,
  validateContractData
};
