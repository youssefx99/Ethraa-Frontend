import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { styled } from '@mui/material/styles';
import Header from '../../common/Header';

// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create RTL theme
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Cairo, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const API_URL = "http://localhost:3030";
const API_URL2 = process.env.REACT_APP_API_URL;

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '1.5rem',
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '12px 32px',
  textTransform: 'none',
  fontSize: '1.1rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
  transition: 'all 0.3s ease',
}));

const LevelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: '100%',
  alignItems: 'flex-start',
}));

const NumberInput = styled(TextField)(({ theme }) => ({
  width: '20%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f5f5f5',
  },
}));

const TextInput = styled(TextField)(({ theme }) => ({
  width: '80%',
}));

const ContractContent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [isNewContractDialogOpen, setIsNewContractDialogOpen] = useState(false);
  const [newContractYear, setNewContractYear] = useState('');
  const [newContractYearHijri, setNewContractYearHijri] = useState('');
  const [formData, setFormData] = useState({
    clausesFour: '',
    KinderPrice_Number: '',
    KinderPrice_Text: '',
    ElementaryPrice_Number: '',
    ElementaryPrice_Text: '',
    MiddlePrice_Number: '',
    MiddlePrice_Text: '',
    HighPrice_Number: '',
    HighPrice_Text: '',
    TwoPath_Price: '',
    OnePath_Price: '',
    OnePathTax_Price: '',
    TwoPathTax_Price: '',
    ClauseSeven_One: '',
    ClauseSeven_Two: '',
    ClauseSeven_Three: '',
    ClauseSeven_Four: '',
    ClauseSeven_Five: '',
    ClauseSeven_Six: '',
    ClauseSeven_Seven: '',
    ClauseSeven_Eight: '',
    ClauseSeven_Nine: '',
    ClauseSeven_Ten: '',
    ClauseSeven_Eleven: '',
    ClauseSeven_Twelve: '',
    ClauseEight_One: '',
    ClauseEight_Two: '',
    ClauseEight_CaseOne_Price: '',
    ClauseEight_caseThree_Percentage: '',
    ClauseEight_caseFour_Percentage: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  // Fetch all contracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []);

  // Load contract data when a contract is selected
  useEffect(() => {
    if (selectedContractId) {
      loadContractData(selectedContractId);
    }
  }, [selectedContractId]);

  // Fetch contracts from the backend
  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_URL2}/api/contract-variables`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch contracts');
      const data = await response.json();
      setContracts(data.data);
    } catch (err) {
      setError('Error fetching contracts: ' + err.message);
    }
  };

  // Load contract data
  const loadContractData = async (contractId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL2}/api/contract-variables`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch contracts');
      const data = await response.json();
      
      const contract = data.data.find(c => c._id === contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      const processedData = {
        ...contract,
        KinderPrice_Number: contract.KinderPrice_Number ? Number(contract.KinderPrice_Number) : '',
        ElementaryPrice_Number: contract.ElementaryPrice_Number ? Number(contract.ElementaryPrice_Number) : '',
        MiddlePrice_Number: contract.MiddlePrice_Number ? Number(contract.MiddlePrice_Number) : '',
        HighPrice_Number: contract.HighPrice_Number ? Number(contract.HighPrice_Number) : '',
        TwoPath_Price: contract.TwoPath_Price ? Number(contract.TwoPath_Price) : '',
        OnePath_Price: contract.OnePath_Price ? Number(contract.OnePath_Price) : '',
        OnePathTax_Price: contract.OnePathTax_Price ? Number(contract.OnePathTax_Price) : '',
        TwoPathTax_Price: contract.TwoPathTax_Price ? Number(contract.TwoPathTax_Price) : '',
        ClauseEight_CaseOne_Price: contract.ClauseEight_CaseOne_Price ? Number(contract.ClauseEight_CaseOne_Price) : '',
        ClauseEight_caseThree_Percentage: contract.ClauseEight_caseThree_Percentage ? Number(contract.ClauseEight_caseThree_Percentage) : '',
        ClauseEight_caseFour_Percentage: contract.ClauseEight_caseFour_Percentage ? Number(contract.ClauseEight_caseFour_Percentage) : '',
      };
      setFormData(processedData);
    } catch (err) {
      setError('Error loading contract data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle contract selection
  const handleContractSelect = (event) => {
    setSelectedContractId(event.target.value);
  };

  // Handle new contract creation
  const handleCreateNewContract = async () => {
    if (!newContractYear || !newContractYearHijri) {
      setError('يرجى إدخال السنة الدراسية الميلادية والهجرية');
      return;
    }

    // Validate year format only
    const yearRegex = /^\d{4}-\d{4}$/;
    if (!yearRegex.test(newContractYear) || !yearRegex.test(newContractYearHijri)) {
      setError('يرجى إدخال السنة الدراسية بالصيغة الصحيحة (مثال: 2024-2025)');
      return;
    }

    // Validate that the second year is greater than the first year
    const [startYear, endYear] = newContractYear.split('-').map(Number);
    const [startYearHijri, endYearHijri] = newContractYearHijri.split('-').map(Number);
    
    if (endYear <= startYear) {
      setError('يجب أن تكون السنة الثانية أكبر من السنة الأولى');
      return;
    }

    if (endYearHijri <= startYearHijri) {
      setError('يجب أن تكون السنة الهجرية الثانية أكبر من السنة الهجرية الأولى');
      return;
    }

    setLoading(true);
    try {
      // Create a new contract object with only the required fields
      const newContract = {
        contractYear: newContractYear,
        contractYearHijri: newContractYearHijri,
        clausesFour: '',
        KinderPrice_Number: '',
        KinderPrice_Text: '',
        ElementaryPrice_Number: '',
        ElementaryPrice_Text: '',
        MiddlePrice_Number: '',
        MiddlePrice_Text: '',
        HighPrice_Number: '',
        HighPrice_Text: '',
        TwoPath_Price: '',
        OnePath_Price: '',
        OnePathTax_Price: '',
        TwoPathTax_Price: '',
        ClauseSeven_One: '',
        ClauseSeven_Two: '',
        ClauseSeven_Three: '',
        ClauseSeven_Four: '',
        ClauseSeven_Five: '',
        ClauseSeven_Six: '',
        ClauseSeven_Seven: '',
        ClauseSeven_Eight: '',
        ClauseSeven_Nine: '',
        ClauseSeven_Ten: '',
        ClauseSeven_Eleven: '',
        ClauseSeven_Twelve: '',
        ClauseEight_One: '',
        ClauseEight_Two: '',
        ClauseEight_CaseOne_Price: '',
        ClauseEight_caseThree_Percentage: '',
        ClauseEight_caseFour_Percentage: '',
        isActive: true
      };

      const response = await fetch(`${API_URL2}/api/contract-variables`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContract),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إنشاء العقد');
      }
      
      const data = await response.json();
      setContracts([...contracts, data.data]);
      setSelectedContractId(data.data._id);
      setIsNewContractDialogOpen(false);
      setNewContractYear('');
      setNewContractYearHijri('');
      setFormData(newContract); // Update form data with the new empty contract
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إنشاء العقد');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value === undefined || value === null || 
          (typeof value === 'string' && value.trim() === '') ||
          (typeof value === 'number' && isNaN(value))) {
        errors[key] = 'هذا الحقل مطلوب';
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Modify handleSubmit to update existing contract
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (!selectedContractId) {
      setError('Please select a contract first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL2}/api/contract-variables/${selectedContractId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update contract');

      setSuccess(true);
      setError('');
      fetchContracts();
    } catch (err) {
      setError(err.message || 'An error occurred while saving the contract');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (contract, event) => {
    event.stopPropagation(); // Prevent dropdown from opening
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contractToDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL2}/api/contract-variables/${contractToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في حذف العقد');
      }

      // Remove the deleted contract from the list
      setContracts(contracts.filter(c => c._id !== contractToDelete._id));
      
      // If the deleted contract was selected, clear the selection
      if (selectedContractId === contractToDelete._id) {
        setSelectedContractId('');
        setFormData({
          clausesFour: '',
          KinderPrice_Number: '',
          KinderPrice_Text: '',
          ElementaryPrice_Number: '',
          ElementaryPrice_Text: '',
          MiddlePrice_Number: '',
          MiddlePrice_Text: '',
          HighPrice_Number: '',
          HighPrice_Text: '',
          TwoPath_Price: '',
          OnePath_Price: '',
          OnePathTax_Price: '',
          TwoPathTax_Price: '',
          ClauseSeven_One: '',
          ClauseSeven_Two: '',
          ClauseSeven_Three: '',
          ClauseSeven_Four: '',
          ClauseSeven_Five: '',
          ClauseSeven_Six: '',
          ClauseSeven_Seven: '',
          ClauseSeven_Eight: '',
          ClauseSeven_Nine: '',
          ClauseSeven_Ten: '',
          ClauseSeven_Eleven: '',
          ClauseSeven_Twelve: '',
          ClauseEight_One: '',
          ClauseEight_Two: '',
          ClauseEight_CaseOne_Price: '',
          ClauseEight_caseThree_Percentage: '',
          ClauseEight_caseFour_Percentage: '',
        });
      }

      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء حذف العقد');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setContractToDelete(null);
    }
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="lg" dir="rtl">

          <StyledPaper>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/students')}
              sx={{ mr: 2 }}
            >
              العودة إلى صفحة الطلاب
            </Button>
          </Box>

            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
              تعديل نموذج العقد
            </Typography>

            {/* Contract Selection Section */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>اختر السنة الدراسية</InputLabel>
                <Select
                  value={selectedContractId}
                  onChange={handleContractSelect}
                  label="اختر السنة الدراسية"
                >
                  {contracts.map((contract) => (
                    <MenuItem 
                      key={contract._id} 
                      value={contract._id}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover .delete-button': {
                          visibility: 'visible',
                        },
                      }}
                    >
                      <span>{contract.contractYear} ({contract.contractYearHijri})</span>
                      <Button
                        className="delete-button"
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={(e) => handleDeleteClick(contract, e)}
                        sx={{ 
                          visibility: 'hidden',
                          ml: 1,
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          fontSize: '0.75rem',
                        }}
                      >
                        حذف
                      </Button>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsNewContractDialogOpen(true)}
              >
                إضافة عقد جديد
              </Button>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              dir="rtl"
            >
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogContent>
                <Typography>
                  هل أنت متأكد من حذف عقد السنة الدراسية {contractToDelete?.contractYear} ({contractToDelete?.contractYearHijri})؟
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
                <Button 
                  onClick={handleDeleteConfirm} 
                  color="error" 
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'حذف'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* New Contract Dialog */}
            <Dialog open={isNewContractDialogOpen} onClose={() => setIsNewContractDialogOpen(false)}>
              <DialogTitle>إضافة عقد جديد</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField
                    label="السنة الدراسية (ميلادي)"
                    value={newContractYear}
                    onChange={(e) => setNewContractYear(e.target.value)}
                    placeholder="مثال: 2024-2025"
                    fullWidth
                  />
                  <TextField
                    label="السنة الدراسية (هجري)"
                    value={newContractYearHijri}
                    onChange={(e) => setNewContractYearHijri(e.target.value)}
                    placeholder="مثال: 1445-1446"
                    fullWidth
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsNewContractDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleCreateNewContract} variant="contained" color="primary">
                  إنشاء
                </Button>
              </DialogActions>
            </Dialog>

            <form onSubmit={handleSubmit}>
              {/* Prices Section */}
              <SectionTitle variant="h5">معلومات الأسعار</SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                {/* Kindergarten Level */}
                <LevelContainer>
                  <NumberInput
                    required
                    label="رسوم رياض الأطفال (رقم)"
                    name="KinderPrice_Number"
                    value={formData.KinderPrice_Number}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.KinderPrice_Number}
                    helperText={formErrors.KinderPrice_Number}
                  />
                  <TextInput
                    required
                    label="رسوم رياض الأطفال (نص)"
                    name="KinderPrice_Text"
                    value={formData.KinderPrice_Text}
                    onChange={handleChange}
                    dir="rtl"
                    error={!!formErrors.KinderPrice_Text}
                    helperText={formErrors.KinderPrice_Text}
                  />
                </LevelContainer>

                {/* Elementary Level */}
                <LevelContainer>
                  <NumberInput
                    required
                    label="رسوم المرحلة الابتدائية (رقم)"
                    name="ElementaryPrice_Number"
                    value={formData.ElementaryPrice_Number}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.ElementaryPrice_Number}
                    helperText={formErrors.ElementaryPrice_Number}
                  />
                  <TextInput
                    required
                    label="رسوم المرحلة الابتدائية (نص)"
                    name="ElementaryPrice_Text"
                    value={formData.ElementaryPrice_Text || ''}
                    onChange={handleChange}
                    dir="rtl"
                    error={!!formErrors.ElementaryPrice_Text}
                    helperText={formErrors.ElementaryPrice_Text}
                  />
                </LevelContainer>

                {/* Middle School Level */}
                <LevelContainer>
                  <NumberInput
                    required
                    label="رسوم المرحلة الإعدادية (رقم)"
                    name="MiddlePrice_Number"
                    value={formData.MiddlePrice_Number}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.MiddlePrice_Number}
                    helperText={formErrors.MiddlePrice_Number}
                  />
                  <TextInput
                    required
                    label="رسوم المرحلة الإعدادية (نص)"
                    name="MiddlePrice_Text"
                    value={formData.MiddlePrice_Text}
                    onChange={handleChange}
                    dir="rtl"
                    error={!!formErrors.MiddlePrice_Text}
                    helperText={formErrors.MiddlePrice_Text}
                  />
                </LevelContainer>

                {/* High School Level */}
                <LevelContainer>
                  <NumberInput
                    required
                    label="رسوم المرحلة الثانوية (رقم)"
                    name="HighPrice_Number"
                    value={formData.HighPrice_Number}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.HighPrice_Number}
                    helperText={formErrors.HighPrice_Number}
                  />
                  <TextInput
                    required
                    label="رسوم المرحلة الثانوية (نص)"
                    name="HighPrice_Text"
                    value={formData.HighPrice_Text}
                    onChange={handleChange}
                    dir="rtl"
                    error={!!formErrors.HighPrice_Text}
                    helperText={formErrors.HighPrice_Text}
                  />
                </LevelContainer>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Path Prices Section */}
              <SectionTitle variant="h5">سعر المسارات (الانتقالات)</SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                <LevelContainer>
                  <NumberInput
                    required
                    label="سعر المسار الواحد"
                    name="OnePath_Price"
                    value={formData.OnePath_Price}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.OnePath_Price}
                    helperText={formErrors.OnePath_Price}
                  />
                  <NumberInput
                    required
                    label="سعر ضريبة المسار الواحد"
                    name="OnePathTax_Price"
                    value={formData.OnePathTax_Price}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.OnePathTax_Price}
                    helperText={formErrors.OnePathTax_Price}
                  />
                </LevelContainer>

                <LevelContainer>
                  <NumberInput
                    required
                    label="سعر المسار المزدوج"
                    name="TwoPath_Price"
                    value={formData.TwoPath_Price}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.TwoPath_Price}
                    helperText={formErrors.TwoPath_Price}
                  />
                  <NumberInput
                    required
                    label="سعر ضريبة المسار المزدوج"
                    name="TwoPathTax_Price"
                    value={formData.TwoPathTax_Price}
                    onChange={handleChange}
                    type="number"
                    dir="rtl"
                    error={!!formErrors.TwoPathTax_Price}
                    helperText={formErrors.TwoPathTax_Price}
                  />
                </LevelContainer>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Clause Four */}
              <SectionTitle variant="h5">البند الرابع</SectionTitle>
              <TextField
                required
                fullWidth
                label="محتوى البند الرابع"
                name="clausesFour"
                value={formData.clausesFour}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                dir="rtl"
                error={!!formErrors.clausesFour}
                helperText={formErrors.clausesFour}
              />

              <Divider sx={{ my: 4 }} />

              {/* Clause Seven */}
              <SectionTitle variant="h5">البند السابع</SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                  const clauseName = num === 1 ? 'الأول' : 
                                   num === 2 ? 'الثاني' : 
                                   num === 3 ? 'الثالث' : 
                                   num === 4 ? 'الرابع' : 
                                   num === 5 ? 'الخامس' : 
                                   num === 6 ? 'السادس' : 
                                   num === 7 ? 'السابع' : 
                                   num === 8 ? 'الثامن' : 
                                   num === 9 ? 'التاسع' : 
                                   num === 10 ? 'العاشر' : 
                                   num === 11 ? 'الحادي عشر' : 'الثاني عشر';
                  
                  const englishName = num === 1 ? 'One' :
                                    num === 2 ? 'Two' :
                                    num === 3 ? 'Three' :
                                    num === 4 ? 'Four' :
                                    num === 5 ? 'Five' :
                                    num === 6 ? 'Six' :
                                    num === 7 ? 'Seven' :
                                    num === 8 ? 'Eight' :
                                    num === 9 ? 'Nine' :
                                    num === 10 ? 'Ten' :
                                    num === 11 ? 'Eleven' : 'Twelve';
                  
                  const fieldName = `ClauseSeven_${englishName}`;
                  
                  return (
                    <TextField
                      key={num}
                      required
                      fullWidth
                      label={`البند السابع - ${clauseName}`}
                      name={fieldName}
                      value={formData[fieldName]}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      margin="normal"
                      dir="rtl"
                      error={!!formErrors[fieldName]}
                      helperText={formErrors[fieldName]}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          width: '100%',
                        },
                      }}
                    />
                  );
                })}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Clause Eight */}
              <SectionTitle variant="h5">البند الثامن</SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  required
                  fullWidth
                  label="البند الثامن - الأول"
                  name="ClauseEight_One"
                  value={formData.ClauseEight_One}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  margin="normal"
                  dir="rtl"
                  error={!!formErrors.ClauseEight_One}
                  helperText={formErrors.ClauseEight_One}
                />
                <TextField
                  required
                  fullWidth
                  label="البند الثامن - الثاني"
                  name="ClauseEight_Two"
                  value={formData.ClauseEight_Two}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  margin="normal"
                  dir="rtl"
                  error={!!formErrors.ClauseEight_Two}
                  helperText={formErrors.ClauseEight_Two}
                />

                <Box sx={{ mt: 4 }}>
                  <SectionTitle variant="h5">رسوم الانسحاب</SectionTitle>
                  <TextField
                    required
                    fullWidth
                    label="رسوم الانسحاب بعد إتمام إجراءات التسجيل وتوقيع العقد وسداد رسوم حجز المقعد"
                    name="ClauseEight_CaseOne_Price"
                    value={formData.ClauseEight_CaseOne_Price}
                    onChange={handleChange}
                    type="number"
                    margin="normal"
                    dir="rtl"
                    error={!!formErrors.ClauseEight_CaseOne_Price}
                    helperText={formErrors.ClauseEight_CaseOne_Price}
                  />
                  <TextField
                    required
                    fullWidth
                    label="نسبة السداد عند الانسحاب خلال الأسبوع الأول من الفصل الدراسي"
                    name="ClauseEight_caseThree_Percentage"
                    value={formData.ClauseEight_caseThree_Percentage}
                    onChange={handleChange}
                    type="number"
                    margin="normal"
                    dir="rtl"
                    error={!!formErrors.ClauseEight_caseThree_Percentage}
                    helperText={formErrors.ClauseEight_caseThree_Percentage}
                  />
                  <TextField
                    required
                    fullWidth
                    label="نسبة السداد عند الانسحاب من بداية الأسبوع الثاني وحتى نهاية الأسبوع الثالث من الفصل الدراسي"
                    name="ClauseEight_caseFour_Percentage"
                    value={formData.ClauseEight_caseFour_Percentage}
                    onChange={handleChange}
                    type="number"
                    margin="normal"
                    dir="rtl"
                    error={!!formErrors.ClauseEight_caseFour_Percentage}
                    helperText={formErrors.ClauseEight_caseFour_Percentage}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
                </StyledButton>
              </Box>
            </form>

            <Snackbar
              open={success}
              autoHideDuration={6000}
              onClose={() => setSuccess(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity="success" onClose={() => setSuccess(false)}>
                تم تحديث نموذج العقد بنجاح!
              </Alert>
            </Snackbar>

            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={() => setError('')}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            </Snackbar>
          </StyledPaper>
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default ContractContent;
