'use client'

import Filter from '@/app/components/Filter/Filter';
import GenreSelect from '@/app/components/Filter/GenreSelect';
import ScoreFilter from '@/app/components/Filter/ScoreFilter';
import ContentHeader from '@/app/components/Page/ContentHeader';
import Slider from '@/app/components/Slider/Slider';
import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useState } from 'react';
//import { ReactNode, useState } from 'react';

const InfiniteScrollMovies = dynamic(
  () => import('../../components/Infinite/InfiniteScroll'),
  {
    ssr: false,
    loading: () => <p>Loading movies...</p>,
  }
);

type FilterItemType = 'year' | 'genre' | 'rating';

type FilterItem = {
  label: string;
  content: ReactNode;
  type: FilterItemType;
};

const filterItems: FilterItem[] = [
  { 
    label: 'Godina izdanja', 
    content: <Slider min={1900} max={2024} step={0.1} />, 
    type: 'year'
  },
  { 
    label: 'Žanrovi', 
    content: <GenreSelect />,
    type: 'genre'
  }, 
  { 
    label: 'Ocjena', 
    content: <ScoreFilter />,
    type: 'rating'
  }
];

const Najgledanije = () => {
  const [tabSelectionState, setTabSelectionState] = useState<Record<FilterItemType, boolean>>({
    'year': false,
    'genre': false,
    'rating': false
  })

  useEffect(() => {
    window.addEventListener('click', handleMouseClick);
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);

  // Called on every mouse click but is only used to check if clicked element 'data-key' value is one of filter keys
  // If not, then mouse click is done outside filters and remove focus from all filters
  // 'closest' makes sure that we are detecting click only on elements with 'filter-item' class, otherwise click might be detected on child element
  const handleMouseClick = (e: any) => {
    const target = e.target as HTMLElement;
    const clickedOutsideOfFilters = !filterItems.find(f => f.type == target.closest('.filter-item')?.getAttribute('data-key'))
    if(clickedOutsideOfFilters) 
      changeTabState(undefined)
  };

  // For each key check if its the one clicked, if yes toogle its state, if not deselect it
  const changeTabState = (clickedTabType: FilterItemType | undefined) => {
    const newTabState = {...tabSelectionState};
    const filterTypes = Object.keys(newTabState) as FilterItemType[];
    filterTypes.forEach(type => {
      if(type == clickedTabType)
        newTabState[type] = !newTabState[type]
      else
        newTabState[type] = false
    })
    setTabSelectionState(newTabState)
  }

  return (
    <div className='px-[1rem] lg:px-[4rem]  flex flex-col gap-[1rem]'>
      <ContentHeader
        title='Najgledaniji filmovi i serije – JustWatch Hrvatska'
        content='Drago nam je da ste ovdje! Na JustWatchu možete lako doznati gdje gledati svoje omiljene filmove i serije u Hrvatskoj. JustWatch je brz i učinkovit: odaberite omiljenog pružatelja usluga i doznajte što je novo na Netflixu i drugim streaming platformama. Filtrirajte po žanru i godini izdanja kako biste pronašli savršen film za večeras. Potražite određeni film ili seriju i doznajte gdje ih možete legalno gledati.'
      />
      <div className='flex flex-row'>
        {filterItems.map((filter, index) => (
          <Filter
            key={filter.type}
            dataKey={filter.type}
            isOpen={tabSelectionState[filter.type]}
            onClick={() => changeTabState(filter.type)} 
            {...filter} 
          />
        ))}
      </div>
      <InfiniteScrollMovies />
    </div>
  );
};

export default Najgledanije;
