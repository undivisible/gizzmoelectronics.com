import type { PageServerLoad } from './$types';

export interface Manual {
  id: string;
  title: string;
  category: string;
  files: {
    quickstart?: string;
    instructions?: string;
  };
}

// Manuals data
const manuals: Manual[] = [
  // Boost Controllers
  {
    id: 'boost_controllers-v4_1.00',
    title: 'V4 1.00',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.00/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.00/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_1.10',
    title: 'V4 1.10',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.10/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.10/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_1.11',
    title: 'V4 1.11',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.11/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.11/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_1.12',
    title: 'V4 1.12',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.12/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.12/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_IBC_1.10',
    title: 'V4 IBC 1.10',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_IBC_1.10/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_IBC_1.10/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_IBC_1.12',
    title: 'V4 IBC 1.12',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_IBC_1.12/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_IBC_1.12/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-IBCR',
    title: 'IBCR',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/IBCR/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-IBC',
    title: 'IBC',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/IBC/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-MS2',
    title: 'MS2',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/MS2/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-MSIBC',
    title: 'MSIBC',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/MSIBC/instructions.pdf'
    }
  },
  // Shiftlight
  {
    id: 'shiftlight-CB1S',
    title: 'CB1S',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/CB1S/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-DSII-L',
    title: 'DSII-L',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/DSII-L/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-DSII',
    title: 'DSII',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/DSII/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-DS',
    title: 'DS',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/DS/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-TR2',
    title: 'TR2',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/TR2/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-TR',
    title: 'TR',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/TR/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-original_shiftlight',
    title: 'Original Shiftlight',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/original_shiftlight/instructions.pdf'
    }
  }
];

export const prerender = true;

export const load: PageServerLoad = async () => {
  return { manuals };
};