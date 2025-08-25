'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Save, RotateCcw } from 'lucide-react';

interface FormActionsProps {
  onSave: () => void;
  onRevert: () => void;
  isSaving: boolean;
  hasChanges: boolean;
  saveLabel?: string;
  revertLabel?: string;
}

export function FormActions({ 
  onSave, 
  onRevert, 
  isSaving, 
  hasChanges,
  saveLabel = 'Save Changes',
  revertLabel = 'Revert'
}: FormActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onSave}
        disabled={isSaving || !hasChanges}
        className="min-w-[120px]"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {saveLabel}
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={onRevert}
        disabled={isSaving || !hasChanges}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        {revertLabel}
      </Button>
    </div>
  );
}