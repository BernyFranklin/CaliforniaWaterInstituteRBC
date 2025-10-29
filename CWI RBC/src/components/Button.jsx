// Base button styles and variant styles
const buttonStyles = {
  base: {
    border: 'none',
    padding: '0.75rem 1.5rem',
    fontSize: '1.25rem',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease'
  },
  
  // Hover styles for different variants
  hover: {
    textDecoration: 'underline'
  },
  
  // Button variant styles
  variants: {
    'red-button': {
      backgroundColor: '#b1102b',
      color: '#fff'
    },
    
    'red-button-hover': {
      backgroundColor: '#8a0e20'
    },
    
    'purple-button': {
      backgroundColor: '#5344f4',
      marginTop: '1rem',
      color: '#fff'
    },
    
    'purple-button-hover': {
      backgroundColor: '#292547'
    },
    
    'gray-button': {
      backgroundColor: '#777',
      color: '#fff'
    },
    
    'gray-button-hover': {
      textDecoration: 'none',
      cursor: 'default'
    }
  }
};

export default function Button({ className, text }) {
  // Combine base styles with variant styles
  const getButtonStyle = (variant) => {
    const baseStyle = { ...buttonStyles.base };
    const variantStyle = buttonStyles.variants[variant] || {};
    return { ...baseStyle, ...variantStyle };
  };

  // Handle hover states
  const handleMouseEnter = (e) => {
    const variant = className;
    if (variant === 'gray-button') {
      // Gray button has special hover behavior (no underline, default cursor)
      e.target.style.textDecoration = 'none';
      e.target.style.cursor = 'default';
    } else {
      // Other buttons get underline on hover
      e.target.style.textDecoration = 'underline';
      
      // Apply variant-specific hover background colors
      if (variant === 'red-button') {
        e.target.style.backgroundColor = '#8a0e20';
      } else if (variant === 'purple-button') {
        e.target.style.backgroundColor = '#292547';
      }
    }
  };

  const handleMouseLeave = (e) => {
    const variant = className;
    // Reset to original styles
    e.target.style.textDecoration = 'none';
    e.target.style.cursor = 'pointer';
    
    // Reset to original background colors
    if (variant === 'red-button') {
      e.target.style.backgroundColor = '#b1102b';
    } else if (variant === 'purple-button') {
      e.target.style.backgroundColor = '#5344f4';
    } else if (variant === 'gray-button') {
      e.target.style.backgroundColor = '#777';
    }
  };

  return (
    <button 
      style={getButtonStyle(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </button>
  );
}
