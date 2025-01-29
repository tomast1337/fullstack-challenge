import { Input } from '@frontend/components/ui/input';
import { Button } from '@frontend/components/ui/button';
import { Label } from '@radix-ui/react-label';
import SearchIcon from '@mui/icons-material/Search';

export const SearchProducts = () => {
  return (
    <>
      <Label className='text-sm text-gray-300'>Search for Products</Label>
      <div className='relative'>
        <Input placeholder='Search...' className='rounded-lg pl-10' />
      </div>
      <Button className='bg-blue-600 hover:bg-blue-500 transition rounded-lg'>
        <SearchIcon className='w-5 h-5' />
        Search
      </Button>
    </>
  );
};
