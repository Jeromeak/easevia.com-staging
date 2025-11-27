export const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#14b8a6',
    colorBackground: '#000000',
    colorText: '#ffffff',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '7px',
  },
  rules: {
    '.Tab': {
      backgroundColor: '#000000',
      border: '1px solid #343434',
      color: '#ffffff',
    },
    '.Tab:hover': {
      backgroundColor: '#1a1a1a',
    },
    '.Tab--selected': {
      backgroundColor: '#14b8a6',
      color: '#000000',
    },
    '.Input': {
      backgroundColor: '#000000',
      border: '1px solid #343434',
      color: '#ffffff',
    },
    '.Input:focus': {
      borderColor: '#14b8a6',
    },
    '.Label': {
      color: '#ffffff',
    },
    '.Text': {
      color: '#ffffff',
    },
    '.Field': {
      backgroundColor: '#000000',
    },
    '.Field--focused': {
      borderColor: '#14b8a6',
    },
  },
};
